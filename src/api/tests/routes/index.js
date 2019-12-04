const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('express')()
const chaiHttp = require('chai-http')

chai.use(chaiAsPromised)
chai.use(chaiHttp)
chai.should()

describe('Index Route', () => {
  it('Should response with a 200 status on GET', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status, 200)
        expect(err).to.equal(null)
        done();
      });
  })
})