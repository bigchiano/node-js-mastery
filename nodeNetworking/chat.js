const server = require('net').createServer()
let counter = 0
let sockets = {}
function timestamp() {
    const now = new Date()
    return `${now.getHours()}:${now.getMinutes()}`    
}


server.on('connection', socket => {
    socket.id = counter++

    console.log('Client connected')
    socket.write('Please type your name: ')

    socket.on('data', data => {
        if (!sockets[socket.id]) {
            socket.name = data.toString().trim()
            socket.write(`Welcome ${socket.name}! \n`)
            sockets[socket.id] = socket

            console.log(`${socket.name} joined \n`)
            Object.entries(sockets).forEach(([key, cs]) => {
                if (socket.id == key) return
                cs.write(`${socket.name} joined `)
            })
            return
        }

        console.log(`${socket.name} ${timestamp()}: ${data} \n`)
        Object.entries(sockets).forEach(([key, cs]) => {
            if (socket.id == key) return
            cs.write(`${socket.name} ${timestamp()}: `)
            cs.write(data)
        })

    })
    
    socket.on('end', () => {
        console.log(`${socket.name} disconnected \n`)
        
        Object.entries(sockets).forEach(([key, cs]) => {
            if (socket.id == key) return
            cs.write(`${socket.name} disconnected`)
        })

        delete sockets[socket.id]
    })
})

server.listen(8000, () => console.log('Server bound'))