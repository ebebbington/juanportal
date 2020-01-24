const redis = require('redis')
const RedisHelper = require('../helpers/RedisHelper')
const Redis = new RedisHelper({pub: true, sub: true})

Redis.sub.on('subscribe', (channel, count) => {
    Redis.pub.publish(Redis.channels.chat, 'Ive just subscribed! #sentByNode')
})

Redis.sub.on('message', (channel, message) => {
    if (channel === Redis.channels.chat) {
        console.log('Received message from redis in node: Channel=' + channel + '. Message=' + message)
    }
})

Redis.sub.subscribe(Redis.channels.chat)

setInterval(() => {
    Redis.pub.publish(Redis.channels.chat, 'Pinging the redis channel from node every 1m')
}, 60000);

module.exports = function (io) {
    const app = require('express')
    return app.router
}