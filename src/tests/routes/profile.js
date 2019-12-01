const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('../../app')
const chaiHttp = require('chai-http')
const ProfileModel = require('../../models/ProfileModel')
const fs = require('fs')
const logger = require('../../helpers/logger')
const mongoose = require('mongoose')
const ProfileController = require('../../controllers/ProfileController')
const chaiFiles = require('chai-files')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const chaiFile = chaiFiles.file
chai.use(chaiAsPromised)
chai.use(chaiHttp)
chai.should()

// turn off logging
logger.info = function (a) {}
logger.debug = function (e) {}

describe('Profile Route', () => {
  /**
   * POST /profile/add
   *
   * Test adding a user, which we will also use further down
   */
  describe('POST /profile/add', () => {
    const newTestProfile = {
      name: 'Super wierd odd test account name',
      description: 'Hello world',
      image: function () {
        return fs.readFile('../../public/images/sample.jpg', (data) => {
          return data
        })
      }
    }
    it('Should respond with a 200 with valid data', (done) => {
      chai.request(app)
        .post('/profile/add', upload.single('image'))
        .field('name', newTestProfile.name)
        .field('description', newTestProfile.description)
        .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
        .end((err, res) => {
          expect(res.status, 200)
          done();
        });
    })
    it('Should fail when name doesnt meet validation')
    it('Should fail when image doesnt meet validation')
    it('Should have saved the user', (done) => {
      ProfileModel.findOneByName(newTestProfile.name)
        .then((profile) => {
          expect(profile.name).to.equal(newTestProfile.name)
          expect(profile.description).to.equal(newTestProfile.description)
          done()
        })
    })
    it('Should have created a file', (done) => {
      ProfileModel.findOneByName(newTestProfile.name)
      .then((profile) => {
        const filePath = '/var/www/juanportal' + profile.image
        expect(chaiFile(filePath)).to.exist
        done()
      })
    })
    // after('Remove the test user')
  })

  describe('GET /profile/id/:id', () => {
    it('Should get a profile with a valid id', () => {
      ProfileModel.getOneByName(newTestProfile.name)
        .then((profile) => {
          const id = profile._id
          chai.request(app)
            .get('/profile/id/' + id)
            .end((err, res) => {
              expect(res.status, 200)
              done();
            });
        })
    })
    it('Should fail when getting a profile with an invalid id')
  })

  describe('GET /profile/add', () => {
    it('Should respond with a 200', (done) => {
      chai.request(app)
      .get('/profile/add')
      .end((err, res) => {
        expect(res.status).to.equal(200)
        done();
      });
    })
  })

  describe('DELETE /profile/id/:id', () => {
    it('Should respond with 200 on valid profile')
    it('Should not respond with 200 on invalid profile')
    it('Should have removed the profile')
    it('Should have removed the file from the filesystem')
  })
  /**
   * Remove the newly created account
   */
  // after('Remove the test account', () => {
  //   ProfileController.deleteImageFromFileSystem(newUserImage)
  //   ProfileModel.deleteOneById(newUserId)
  // })
})