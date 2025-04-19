const wheelsRouter = require('express').Router()
const prisma = require('../utils/prisma')

wheelsRouter.get('/', async (request, response) => {
    if (process.env.NODE_ENV !== "test" && !request.user?.id) {
        return response.status(401).send({ error: 'invalid token' })
    } 

    wheels = await prisma.wheel.findMany({
        where: {userId: request.user.id}
    })
    response.status(200).json(wheels)
})

wheelsRouter.put('/', async (request, response) => {
    if (process.env.NODE_ENV !== "test" && !request.user?.id) {
        return response.status(401).send({ error: 'invalid token' })
    } 
    const wheel = request.body
    
    const savedWheel = await prisma.wheel.create({data: wheel})
    response.status(200).json(savedWheel)
})

module.exports = wheelsRouter