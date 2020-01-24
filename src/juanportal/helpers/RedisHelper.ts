import { throws } from "assert"
const redis = require('redis')
require('dotenv').config()
const logger = require('./logger')

interface IParams {
    cache?: boolean,
    pub?: boolean,
    sub?: boolean
}
interface IKVPair {
    [key: string]: string
}

/**
 * @example
 * const RedisHelper = require('../helpers/RedisHelper')
 * const Redis = new RedisHelper({cache?: true|false, pub?: true|false, sub?: true|false})
 * app.get('/', Redis.cache.route('index'), (req, res) => {})
 * 
 * @param {boolean} cache Define where this instance will be used for caching so it can create the cache property
 * @param {boolean} pub True for if this instance will use a publisher
 * @param {boolean} sub True if this instance will use a subscriber
 */
class RedisHelper {

    public readonly host:           string|undefined    = process.env.REDIS_HOST
    public readonly port:           string|undefined    = process.env.REDIS_PORT
    public readonly cacheDuration:  number|undefined    = Number(process.env.REDIS_CACHE_EXPIRE)
    public          cache:          any|null            = null
    public          sub:            any|null            = null
    public          pub:            any|null            = null
    public readonly channels:       IKVPair             = {
        chat: 'chat'
    }

    public constructor (params: IParams) {
        if (!this.host || !this.port || !this.cacheDuration) {
            logger.error('Env data for Redis has not been correctly defined')
            const data: any = {host: this.host, port: this.port, cacheDuration: this.cacheDuration}
            logger.error(JSON.stringify(data))
        }
        if (params && params.cache) {
            this.cache = require('express-redis-cache')({
                host: this.host,
                port: this.port,
                expire: this.cacheDuration
            });
            this.initialiseCacheLogging()
        }
        if (params && params.sub) {
            this.sub = redis.createClient({host: this.host, port: this.port})
        }
        if (params && params.pub) {
            this.pub = redis.createClient({host: this.host, port: this.port})
        }
    }

    private initialiseCacheLogging () {
        this.cache
            .on('error', (err: any) => {
                logger.error('Redis cache has encourtered a problem')
                logger.error(err)
            })
            .on('message', (message: any) => {
                logger.info('Redis cache has received a message: ' + message)
            })
            .on('connected', () => {
                logger.info('Redis cache has connected')
            })
            .on('disconnected', () => {
                logger.info('Redis cache has disconnected')
            })
    }
}

module.exports = RedisHelper