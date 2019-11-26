const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('../../app')
const chaiHttp = require('chai-http')
const ProfileModel = require('../../models/ProfileModel')
const fs = require('fs')

chai.use(chaiAsPromised)
chai.use(chaiHttp)
chai.should()

describe('Profile Route', () => {
  const newTestProfile = {
    name: 'Super wierd odd test account name',
    description: 'Hello world',
    image: function () {
      return fs.readFile('../../public/images/sample.jpg', (data) => {
        return data
      })
    }
  }

  /**
   * POST /profile/add
   *
   * Test adding a user, which we will also use further down
   */
  it('Should POST /profile/add', (done) => {
    chai.request(app)
      .post('/profile/add')
      .field('name', newTestProfile.name)
      .field('description', newTestProfile.description)
      .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
      .end((err, res) => {
        expect(res.status, 200)
        done();
      });
  })

  let newUserId = null
  before('Get the test account id', () => {
    ProfileModel.getOneByName(newTestProfile.name)
      .then((profile) => {
        newUserId = profile._id
      })
  })

  /**
   * GET /profile?id=
   *
   * Test the route
   */
  it('Should GET /profile?id=[...]', () => {
    ProfileModel.findOneById(newUserId)
      .then((profile) => {
        expect(profile._id).to.equal(newUserId)
      })
  })

  /**
   * GET /profile/add
   *
   * Get the webpage to add a user
   */
  it('Should GET /profile/add', (done) => {
    chai.request(app)
      .get('/profile/add')
      .end((err, res) => {
        expect(res.status, 200)
        done();
      });
  })

  /**
   * GET /profile/delete?id=
   *
   * Delete a profile
   */
  it('Should GET /profile/delete?id=', () => {
    // add a test user then delet eby the object id
  }) // GET /profile/delete?id=jjkkj

  /**
   * Remove the newly created account
   */
  after('Remove the test account', () => {
    ProfileModel.deleteOneById(newUserId)
  })
})