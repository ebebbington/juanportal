const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('.././app')
const mongoose = require('mongoose')

chai.use(chaiAsPromised)
chai.should()

describe('App', () => {
  it('Should set the view engine to Pug', () => {
    expect(app.get('view engine'), 'pug')
  })
  it('Should correctly set the views directory', () => {
    expect(app.get('views'), __dirname + 'views')
  })
  it('Should have connected to the database', () => {
    expect(mongoose.connection.readyState).to.exist
  })
})