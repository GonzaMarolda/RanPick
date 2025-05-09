const colorPalettesRouter = require("express").Router()
const prisma = require('../utils/prisma')

colorPalettesRouter.get('/', async (request, response) => {
    const palettes = await prisma.colorPalette.findMany({})
    response.status(200).json(palettes)
})
  
module.exports = colorPalettesRouter