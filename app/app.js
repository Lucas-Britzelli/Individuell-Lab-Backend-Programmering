const express = require('express') // KRÄV express

const app = express() // SKAPA en express-applikation

const http = require('http') // KRÄV http (node)

const server = http.createServer(app) // SKAPA server av typen Express

const { Server } = require('socket.io') // KRÄV Socket.io-biblioteket och klassen Server
//      ^----^ Klass

const io = new Server(server) // INKLUDERA Socket.io
//         ^--------^ Ny instans av Server-klassen

app.use(express.static('public')) // ANVÄND middleware för statiska filer

const PORT = 3000 // DEFINIERA portnummer

server.listen(PORT, () => {
    // LYSSNA på port
    console.log('Chat app - Listening on port:' + PORT)
})

app.get('/', (req, res) => {
    // HANTERA GET-request

    res.sendFile(__dirname + '/index.html') // SKICKA fil
})

app.get('/chat', (req, res) => {
    // HANTERA GET-request

    res.sendFile(__dirname + '/chat.html') // SKICKA fil
})

app.get('/create', (req, res) => {
    // HANTERA GET-request

    res.sendFile(__dirname + '/create.html') // SKICKA fil
})

app.get('/search', (req, res) => {
    // HANTERA GET-request

    res.sendFile(__dirname + '/search.html') // SKICKA fil
})

// Read
app.get('/read', (req, res) => {
    // HANTERA GET-request

    res.sendFile(__dirname + '/read.html') // SKICKA fil
})

const mainRoom = 'main room'
const waitingRoom = 'waiting room'
let peopleInMainRoom = 0

io.on('connection', (socket) => {
    // PÅ händelsen connection | NIVÅ: I/O (input/output)

    peopleInMainRoom++ // ÖKA antalet personer i main room med 1

    if (peopleInMainRoom <= 2) {
        // OM antalet personer i main room är mindre eller lika med 2, gör följande

        socket.join(mainRoom)

        socket.emit('server message', 'Välkommen till chattrummet')

        console.log('People in main room: ' + peopleInMainRoom)
    } else {
        // ANNARS, gör följande
        socket.join(waitingRoom)
        socket.emit('server message', 'Välkommen till väntrummet ')
        socket.emit('server message', 'Du är placerad i kö...')
    }

    socket.on('disconnect', () => {
        // PÅ händelsen disconnect | NIVÅ: SOCKET (anslutning)
        console.log('A user disconnected')
        peopleInMainRoom-- // MINSKA antalet personer i main room med 1
    })

    socket.on('chat message', (message) => {
        io.to(mainRoom).emit('chat message', message) // YTTRA (skicka) händelsen chat message till main room
    })
})
