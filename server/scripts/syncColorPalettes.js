const { PrismaClient } = require('@prisma/client')
const { palettes } = require('./colorPalettes')

const prisma = new PrismaClient()

async function main() {
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

  console.log('Color palettes synced successfully.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })