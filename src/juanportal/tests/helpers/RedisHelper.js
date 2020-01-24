const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

const logger = require('../../helpers/logger')
logger.debug = function () {}
logger.info = function () {}
const RedisHelper = require('../../helpers/RedisHelper')
require('dotenv').config()

chai.use(chaiAsPromised)
chai.should()

describe('RedisHelper', () => {
    
    describe('Properties', () => {

        describe('host', () => {

            const Redis = new RedisHelper()

            it('Should equal the value in the .env file', () => {
                expect(Redis.host).to.equal(process.env.REDIS_HOST)
            })

        })

        describe('port', () => {

            const Redis = new RedisHelper()

            it('Should equal the value in the .env file', () => {
                expect(Redis.port).to.equal(process.env.REDIS_PORT)
            })

        })

        describe('cacheDuration', () => {

            const Redis = new RedisHelper()

            it('Should equal the value in the .env file', () => {
                expect(Redis.cacheDuration).to.equal(Number(process.env.REDIS_CACHE_EXPIRE))
            })

        })

        describe('cache', () => {

            const Redis = new RedisHelper({cache: true})

            it('Should be defined', () => {
                expect(Redis.cache).to.not.be.empty
            })

        })

        describe('pub/sub', () => {

            const Redis = new RedisHelper({pub: true, sub: true})

            it('Should be defined', () => {
                expect(Redis.pub).to.not.be.empty
                expect(Redis.sub).to.not.be.empty
            })

        })

        describe('channels', () => {

            it('Should contain the correct channels', () => {
                
                const channels = {chat: 'chat'}
                const Redis = new RedisHelper()
                expect(Redis.channels).to.haveOwnProperty('chat')
                expect(Redis.channels.chat).to.equal(channels['chat'])

            })

        })

    })

})