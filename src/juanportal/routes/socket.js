module.exports = function (io) {
    const app = require('express')
    const router = app.Router()
    let connections = 0
    io.on('connection', function (socket) {
        console.log('a user connected')
        socket.on('disconnect', function () {
            console.log('disconnected')
            connections = connections < 1 ? 0 : connections - 1 
            console.log('current connections after leaving: ' + connections)
        })
        socket.on('chat message', function (message) {
            console.log('message: ' + message)
            io.emit('chat message', message)
        })
        socket.on('user joined', function (username) {
            console.log('user joined')
            connections = connections + 1
            console.log('current connections after joining: ' + connections)
            console.log('going to send a user joined message')
            io.sockets.emit('user joined', {totalUsers: connections, username: username})
        })
    })
    return router
}