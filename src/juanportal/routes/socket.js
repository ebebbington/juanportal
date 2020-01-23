const redis = require('redis')
const REDIS_HOST = 'juanportal_redis'
const REDIS_PORT = 6379
const sub = redis.createClient({host: REDIS_HOST, port: REDIS_PORT})
const pub = redis.createClient({host: REDIS_HOST, port: REDIS_PORT})
const CHANNEL = 'chat'

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
    pub.publish(CHANNEL, 'Pinging the redis channel from node every 1m')
}, 60000);

module.exports = function (io) {
    const app = require('express')
    return app.router
}