const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('.././app')
const mongoose = require('mongoose')

import logger from '../helpers/logger'
logger.info = function (a) {}
logger.debug = function (a) {}

chai.use(chaiAsPromised)
chai.should()

describe('App', () => {
  describe('Test specific', () => {
    it('Info logging should be disabled for this test file', () => {
      const response = logger.info('Test')
      expect(response).to.equal(undefined)
    })
    it('Debug logging should be disabled for this test file', () => {
      const response = logger.debug('Test')
      expect(response).to.equal(undefined)
    })
  })
  describe('Middleware', () => {
    it('Should be using cookie parser', () => {
      let found = false
      app._router.stack.forEach(stackObj => {
        if (stackObj.name === 'cookieParser')
          found = true
      });
      expect(found).to.equal(true)
    })
    it('Should be using logger middleware', () => {
      let found = false
      app._router.stack.forEach(stackObj => {
        if (stackObj.name === 'logger')
          found = true
      });
      expect(found).to.equal(true)
    })
    it('Should be using body parser', () => {
      let found = false
      app._router.stack.forEach(stackObj => {
        if (stackObj.name === 'jsonParser')
          found = true
      });
      expect(found).to.equal(true)
    })
  })
  describe('Database', () => {
    it('Should have connected to the database', () => {
      expect(mongoose.connection.readyState).to.equal(1)
    })
    it('Should successfully disconnect from the database', (done) => {
      mongoose.connection.close().then(() => {
        expect(mongoose.connection.readyState).to.equal(0)
        done()
      })
    })
  })
  describe('Environment', () => {
    it('Environment should match the one in the .env file', () => {
      const env = process.env.NODE_ENV
      expect(app.settings.env).to.equal(env)
    })
  })
})