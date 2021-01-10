import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
const expect = chai.expect
import app from '../app'

import logger from '../helpers/logger'

chai.use(chaiAsPromised)
chai.should()

describe('App', () => {
  describe('Middleware', () => {
    it('Should be using cookie parser', () => {
      let found = false
      // @ts-ignore
      app._router.stack.forEach(stackObj => {
        if (stackObj.name === 'cookieParser')
          found = true
      });
      expect(found).to.equal(true)
    })
    it('Should be using logger middleware', () => {
      let found = false
      // @ts-ignore
      app._router.stack.forEach(stackObj => {
        if (stackObj.name === 'logger')
          found = true
      });
      expect(found).to.equal(true)
    })
    it('Should be using body parser', () => {
      let found = false
      // @ts-ignore
      app._router.stack.forEach(stackObj => {
        if (stackObj.name === 'jsonParser')
          found = true
      });
      expect(found).to.equal(true)
    })
  })
  describe('Configurations', () => {
    it('Should set the view engine to Pug', () => {
      expect(app.get('view engine')).to.equal('pug')
    })
    it('Should correctly set the views directory', () => {
      expect(app.get('views')).to.equal('/var/www/juanportal/views')
    })
  })
})