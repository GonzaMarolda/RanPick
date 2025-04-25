import { execSync } from 'child_process'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(__dirname, '../server/.env.test') })

export default async () => {
  execSync('npx prisma migrate reset --force --skip-generate --schema=../server/prisma/schema.prisma', {
    stdio: 'inherit',
  })
}