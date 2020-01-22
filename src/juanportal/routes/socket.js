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
    let listOfUsernames = []
    io.on('connection', function (socket) {
        console.log('a user connected')
        socket.on('disconnect', function (something) {
            console.log('disconnected')
            connections = connections < 1 ? 0 : connections - 1 
            console.log('current connections after leaving: ' + connections)
            console.log(something)
        })
        socket.on('user left', (username) => {
            listOfUsernames = listOfUsernames.filter(un => un !== username);
            io.sockets.emit('chat message', {username: username, message: 'has left the chat'})
            io.sockets.emit('refresh user list', listOfUsernames)
        })
        socket.on('chat message', function (username, message) {
            console.log('message: ' + message)
            io.sockets.emit('chat message', {username: username, message: message})
        })
        socket.on('user joined', function (username) {
            console.log('user joined with the username: ' + username)
            connections = connections + 1
            console.log('current connections after joining: ' + connections)
            console.log('going to send a user joined message')
            listOfUsernames.push(username)
            io.sockets.emit('user joined', {listOfUsernames: listOfUsernames, usernameOfJoinee: username, currentConnections: connections})
        })
    })
    return router
}