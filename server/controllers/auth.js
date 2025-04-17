const authRouter = require("express").Router()
const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt')

async function verifyGoogleToken(googleToken) {
    const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${googleToken}`,
        },
    });
    if (!resp.ok) throw new Error('Invalid Google token')
    const data = await resp.json()
    return data
}

function generateToken(user) {
    const userForToken = {
        username: user.name,
        id: user.id,
      }
      return jwt.sign(userForToken, process.env.SECRET)
}

authRouter.post('/signup', async (request, response) => {
    const reqUser  = request.body.formData

    const hashedPassword = await bcrypt.hash(reqUser.password, 10)
    let user = { email: reqUser.email, name: reqUser.firstName + " " + reqUser.lastName, password: hashedPassword }

    const savedUser = await prisma.user.create({data: user})
    const token = generateToken(savedUser)
  
    response
      .status(200)
      .send({ token, user: savedUser })
})

authRouter.post('/login', async (request, response) => {
    const { email, password }  = request.body
    const googleToken = request.body.googleToken

    let user
    if (googleToken) {
        const userData = await verifyGoogleToken(googleToken)

        const manualUser = await prisma.user.findUnique({
            where: { email: userData.email }
        })
        if (manualUser) { // User already existed but it was created manually?
            data = { ...manualUser, googleId: userData.sub, imagePath: userData.picture }
            user = await prisma.user.update({ where: {email: manualUser.email}, data: data})
        } else {
            user = await prisma.user.findUnique({
                where: { googleId: userData.sub }
            })
            if (!user) {
                data = { email: userData.email, name: userData.name, googleId: userData.sub, imagePath: userData.picture }
                user = await prisma.user.create({data: data})
            }
        }
    } else {
        user = await prisma.user.findUnique({where: { email: email, password: password }})
        if (!user) return response.status(400).send({ error: "Wrong email or password" })
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return response.status(400).send({ error: "Wrong email or password" })
    }

    const token = generateToken(user)

    response
      .status(200)
      .send({ token, user: user })
})
  
module.exports = authRouter