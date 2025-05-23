const express = require("express")
const app = express()
const cors = require("cors")
const middleware = require("./utils/middleware")
const path = require("path")

const authRouter = require("./controllers/auth")
const wheelsRouter = require("./controllers/wheels")
const colorPalettesRouter = require("./controllers/colorPalettes")

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use('/uploads', express.static('uploads'))
app.use(express.static('dist/client/browser'))

app.use("/api/auth", authRouter)
app.use("/api/wheel", middleware.userExtractor, wheelsRouter)
app.use("/api/color-palette", colorPalettesRouter)

app.use(middleware.unknownEndpoint)
app.get('/{*splat}', (req, res, next) => {
    next();
})
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'dist/client/browser/index.html'))
})
app.use(middleware.errorHandler)

module.exports = app