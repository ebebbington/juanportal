const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('.././app')
const chaiHttp = require('chai-http')

const logger = require('../helpers/logger')
logger.info = function (a) {}
logger.debug = function (a) {}

chai.use(chaiAsPromised)
chai.should()
chai.use(chaiHttp)

describe('Route *', () => {
    describe('JWT', () => {
        it('Should create a token')
    })
})

describe('Route /', () => {
    describe('GET', () => {
        it('Should respond with a 200 status', (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    done();
                });
        })
    })
})
describe('Route /profile/add', () => {
    describe('GET', () => {
        it('Should respond with a 200 status', (done) => {
            chai.request(app)
                .get('/profile/add')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    done();
                });
        })
    })
})
describe('Route /profile/view/:id', () => {
    describe('GET', () => {
        it('Should respond with a 200 status', (done) => {
            chai.request(app)
                .get('/profile/view/4439034')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    done();
                });
        })
        it('Should have the id as a data attribute in the view', (done) => {
            const profileId = 44466765
            chai.request(app)
            .get(`/profile/view/${profileId}`)
            .end((err, res) => {
                const hasDivWithId = res.text.includes(`<div id="profile-id" data-id="${profileId}"></div>`)
                expect(hasDivWithId).to.equal(true)
                done();
            });
        })
    })
})