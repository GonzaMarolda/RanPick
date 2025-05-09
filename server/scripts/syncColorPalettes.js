const { PrismaClient } = require('@prisma/client')
const { palettes } = require('./colorPalettes')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const prodEnv = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env')))
const testEnv = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env.test')))

const prismaProd = new PrismaClient({
    datasources: { db: { url: prodEnv.DATABASE_URL } }
})
const prismaTest = new PrismaClient({
    datasources: { db: { url: testEnv.DATABASE_URL } }
})

async function syncPalettes(prisma, dbLabel) {
  const idsInFile = palettes.map(p => p.id)

  for (const palette of palettes) {
    await prisma.colorPalette.upsert({
      where: { id: palette.id },
      update: {
        name: palette.name,
        colors: palette.colors,
      },
      create: {
        id: palette.id,
        name: palette.name,
        colors: palette.colors,
      },
    })
  }

  await prisma.colorPalette.deleteMany({
    where: {
      id: {
        notIn: idsInFile,
      },
    },
  })

  console.log('Color palettes synced successfully on ' + dbLabel)
}

async function main() {
    try {
        await syncPalettes(prismaProd, 'PRODUCTION')
        await syncPalettes(prismaTest, 'TEST')
    } catch (err) {
        console.error('Error:', err)
        process.exit(1)
    } finally {
        await prismaProd.$disconnect()
        await prismaTest.$disconnect()
    }
}

main()