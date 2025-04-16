const express = require("express")
const app = express()
const cors = require("cors")
const middleware = require("./utils/middleware")

const authRouter = require("./controllers/auth")

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

app.use("/api/auth", authRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app