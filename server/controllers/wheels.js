const wheelsRouter = require('express').Router()
const prisma = require('../utils/prisma')

wheelsRouter.get('/', async (request, response) => {
    if (!request.user?.id) {
        return response.status(401).send({ error: 'invalid token' })
    } 

    wheels = await prisma.wheel.findMany({
        where: {userId: request.user.id, fatherWheelId: {equals: null}}
    })
    console.log(wheels)
    response.status(200).json(wheels)
})

wheelsRouter.get('/:id', async (request, response) => {
  if (!request.user?.id) {
      return response.status(401).send({ error: 'invalid token' })
  } 

  const wheel = await getWheelTree({id: request.params.id, userId: request.user.id})
  if (!wheel) return response.status(404).send({ error: 'The wheel does not exist or is not your wheel' })
  response.status(200).json(wheel)
})

wheelsRouter.put('/', async (request, response) => {
    if (!request.user?.id) {
        return response.status(401).send({ error: 'invalid token' })
    } 
    const wheel = request.body
    const savedWheel = await prisma.$transaction(async (tx) => {
      return await upsertWheelTree(wheel, request.user.id, tx)
    }, { timeout: 20000 })

    response.status(200).json(savedWheel)
})

wheelsRouter.delete('/', async (request, response) => {
  if (process.env.NODE_ENV !== 'test') return response.status(401).send({ error: 'unauthorized' })

    await prisma.wheel.deleteMany({})
    response.status(204).send()
})

wheelsRouter.delete('/:id', async (request, response) => {
    if (!request.user?.id) {
        return response.status(401).send({ error: 'invalid token' })
    } 

    const wheel = await prisma.wheel.findUnique({
        include: { entries: true },
        where: {id: request.params.id, userId: request.user.id}
    })
    if (!wheel) {return response.status(404).send({ error: 'The wheel does not exist or is not your wheel' })}

    await prisma.$transaction(async (tx) => {
      await tx.wheel.delete({ where: { id: request.params.id } })
    })

    response.status(204).send()
})

async function getWheelTree({ id, userId }) {
  const wheel = await prisma.wheel.findUnique({
    where: { id, userId },
    include: {
      entries: true,
      selectedHistory: true,
      colorPalette: true
    }
  })
  if (!wheel) return null
  
  for (const entry of wheel.entries) {
    if (entry.nestedWheelId) {
      entry.nestedWheel = await getWheelTree({
        id: entry.nestedWheelId,
        userId
      })
    }
  }

  return wheel
}

async function upsertWheelTree(wheel, userId, tx) {
  console.log("Currently upserting: " + wheel.name + ":")
  console.log(wheel)

  console.log("COLOR PALETTE ID: " + wheel.colorPalette.id)

  await tx.entry.deleteMany({
    where: { wheelId: wheel.id }
  })

  await tx.selectedRecord.deleteMany({
    where: { wheelId: wheel.id }
  })

  const savedWheel = await tx.wheel.upsert({
    where: { id: wheel.id },
    create: {
      id: wheel.id, 
      userId: userId,
      name: wheel.name,
      fatherWheelId: wheel.fatherWheelId,
      fatherEntryId: wheel.fatherEntryId,
      entries: {
        create: wheel.entries.map(entry => ({
          id: entry.id,
          name: entry.name,
          nestedWheelId: wheel.nestedWheel?.id,
          weight: entry.weight,
          color: entry.color
        }))
      },
      selectedHistory: {
        create: wheel.selectedHistory.map(selected => ({
          id: selected.id,
          name: selected.name,
          color: selected.color
        }))
      },
      colorPaletteId: wheel.colorPalette.id
    },
    update: {
      name: wheel.name,
      fatherEntry: wheel.fatherEntryId
        ? { connect: { id: wheel.fatherEntryId } }
        : { disconnect: true },
      entries: {
        create: wheel.entries.map(entry => ({
          id: entry.id,
          name: entry.name,
          nestedWheelId: wheel.entries.find(e => e.id === entry.id).nestedWheel?.id,
          weight: entry.weight,
          color: entry.color
        }))
      },
      selectedHistory: {
        create: wheel.selectedHistory.map(selected => ({
          id: selected.id,
          name: selected.name,
          color: selected.color
        }))
      },
      colorPalette: {
        connect: { id: wheel.colorPalette.id }
      }
    },
    include: {
      entries: true,
      selectedHistory: true,
      colorPalette: true
    }
  })
  
  for (const entry of savedWheel.entries) {
    if (entry.nestedWheelId) {
      console.log("This entry has a nested wheel: " + entry.name)
      entry.nestedWheel = await upsertWheelTree(
        wheel.entries.find(e => e.id === entry.id).nestedWheel, 
        userId,
        tx
      )
    }
  }

  return savedWheel
}

module.exports = wheelsRouter