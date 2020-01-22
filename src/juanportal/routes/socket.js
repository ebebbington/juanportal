const redis = require('redis')

const sub = redis.createClient({host: 'juanportal_redis', port: 6379})
const pub = redis.createClient({host: 'juanportal_redis', port: 6379})
const CHANNEL = 'chat2'

sub.on('subscribe', (channel, count) => {
    pub.publish(CHANNEL, 'Ive just subscribed! #sentByNode')
})

sub.on('message', (channel, message) => {
    if (channel === CHANNEL) {
        console.log('Received message from redis in node: Channel=' + channel + '. Message=' + message)
    }
})

sub.subscribe(CHANNEL)

setInterval(() => {
    pub.publish(CHANNEL, 'Pinging the redis channel from node every 10s')
}, 10000);

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