const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const JWT = require('../../helpers/JWT')
const util = require('util')

const logger = require('../../helpers/logger')
logger.debug = function () {}
logger.info = function () {}

chai.use(chaiAsPromised)
chai.should()

describe('JWT', () => {

    describe('Methods', () => {

        const validPayload = {
            name: 'Edward',
            age: 21
        }
        const invalidPayload = {
            name: null,
            age: 21
        }
        const res = {
            statusCode: null,
            jsonMessage: null,
            status (statusCode) {
                console.log('status was called')
                this.statusCode = statusCode
                return this
            },
            json: function (obj) {
                console.log('json was called')
                this.jsonMessage = obj
                return this
            },
            end () {
                console.log('end was called')
                return this
            }
        }
        const next = function () {
            return true
        }

        describe('createToken', () => {

            it('Should return false if a payload property has no value', () => {
                const token = JWT.createToken(invalidPayload)
                expect(token).to.equal(false)
            })

            it('Should return nothing on valid payload', () => {
                const token = JWT.createToken(validPayload)
                const tokenParts = token.split('.')
                expect(tokenParts.length).to.equal(3)
                const req = {
                    headers: {
                        authorization: token
                    }
                }
                const response = JWT.checkToken(req, res, next)
                expect(response).to.not.exist
            })

        })

        describe.only('checkToken', () => {

            it('Should verify a valid token', () => {
                const token = JWT.createToken(validPayload)
                const req = {
                    headers: {
                        authorization: token
                    }
                }
                const response = JWT.checkToken(req, res, next)
                expect(response).to.not.exist
            })

            it('Should fail when checking an invalid token', () => {
                const req = {
                    headers: {
                        authorization: 'not a valid or signed token'
                    }
                }
                const response = JWT.checkToken(req, res, next)
                expect(response.statusCode).to.equal(403)
                expect(response.jsonMessage.success).to.equal(false)
            })

        })

    })

})