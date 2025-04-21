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

wheelsRouter.get('/:id', async (request, response) => {
  if (process.env.NODE_ENV !== "test" && !request.user?.id) {
      return response.status(401).send({ error: 'invalid token' })
  } 

  wheels = await prisma.wheel.findUnique({
      include: { entries: true },
      where: {id: request.params.id, userId: request.user.id}
  })
  if (!wheels) return response.status(404).send({ error: 'The wheel does not exist or is not your wheel' })
  response.status(200).json(wheels)
})

wheelsRouter.put('/', async (request, response) => {
    if (process.env.NODE_ENV !== "test" && !request.user?.id) {
        return response.status(401).send({ error: 'invalid token' })
    } 
    const { id, name, entries } = request.body

    const savedWheel = await prisma.$transaction(async (tx) => {
      const existingWheel = await tx.wheel.findUnique({ where: { id: id, userId: request.user.id } })
      if (existingWheel) {
        await tx.entry.deleteMany({
          where: { wheelId: id }
        })
      }

      return await tx.wheel.upsert({
        where: { id: id },
        include: { entries: true },
        update: {
          name,
          entries: {
            create: entries.map(entry => ({
              id: entry.id, 
              name: entry.name,
              weight: entry.weight,
              color: entry.color
            }))
          }
        },
        create: {
          id, 
          name,
          userId: request.user.id,
          entries: {
            create: entries.map(entry => ({
              id: entry.id, 
              name: entry.name,
              weight: entry.weight,
              color: entry.color
            }))
          }
        }
      })
    })
    response.status(200).json(savedWheel)
})

wheelsRouter.delete('/:id', async (request, response) => {
    if (process.env.NODE_ENV !== "test" && !request.user?.id) {
        return response.status(401).send({ error: 'invalid token' })
    } 

    const wheel = await prisma.wheel.findUnique({
        include: { entries: true },
        where: {id: request.params.id, userId: request.user.id}
    })
    if (!wheel) {return response.status(404).send({ error: 'The wheel does not exist or is not your wheel' })}

    await prisma.$transaction(async (tx) => {
        await tx.entry.deleteMany({
            where: { wheelId: wheel.id }
        })
        await tx.wheel.delete({
            where: { id: wheel.id }
        })
    })

    response.status(204).send()
})

module.exports = wheelsRouter