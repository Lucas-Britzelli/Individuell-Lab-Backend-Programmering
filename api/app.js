const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3001
app.use(cors())

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

const libraryRouter = require('./routes/library')
app.use('/library', libraryRouter)

app.listen(PORT, () => {
    // LYSSNA på port
    console.log('API - Listening on port:' + PORT)
})
