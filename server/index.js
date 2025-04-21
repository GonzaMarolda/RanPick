const app = require('./app')
const config = require('./utils/config')
const { execSync } = require('child_process')

async function main() {
  const PORT = config.PORT || 3001

  if (process.env.NODE_ENV === 'production') {
    console.log('Applying migrations...')
    execSync('npx prisma generate', { stdio: 'inherit' })
  }
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
  })
}

main()