const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('../../app')
const chaiHttp = require('chai-http')
const ProfileModel = require('../../models/ProfileModel')
const Profile = new ProfileModel()
const fs = require('fs')
const logger = require('../../helpers/logger')
const mongoose = require('mongoose')
const ProfileController = require('../../controllers/ProfileController')
const chaiFiles = require('chai-files')
const ImageHelper = require('../../helpers/ImageHelper')

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
  describe('POST /profile/add', () => {
  
    it('Should respond with a 200 with valid data', (done) => {
      chai.request(app)
        .post('/profile/add', upload.single('image'))
        .field('name', newTestProfile.name)
        .field('description', newTestProfile.description)
        .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          done()
        });
    })

    it('Should fail when name doesnt meet validation', (done) => {
      chai.request(app)
        .post('/profile/add', upload.single('image'))
        .field('name', 'a')
        .field('description', newTestProfile.description)
        .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
        .end((err, res) => {
          expect(res.status).to.equal(400)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(false)
          expect(json.message).to.have.haveOwnProperty('name')
          done();
        });
    })

    it('Should pass when no description is passed in', (done) => {
      chai.request(app)
      .post('/profile/add', upload.single('image'))
      .field('name', newTestProfile.name)
      .field('description', '')
      .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
      .end((err, res) => {
        expect(res.status).to.equal(200)
        done();
      });
    })

    it('Should fail when image doesnt meet validation', (done) => {
      chai.request(app)
        .post('/profile/add', upload.single('image'))
        .field('name', newTestProfile.name)
        .field('description', newTestProfile.description)
        .attach('image', fs.readFileSync('/var/www/juanportal/public/images/test.txt'), 'test.txt')
        .end((err, res) => {
          expect(res.status).to.equal(400)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(false)
          expect(json.message).to.have.haveOwnProperty('image')
          done();
        });
    })

    it('Should pass when no image is passed in', (done) => {
      chai.request(app)
        .post('/profile/add', upload.single('image'))
        .field('name', newTestProfile.name)
        .field('description', newTestProfile.description)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          done();
        });
    })

    it('Should have saved the user', (done) => {
      chai.request(app)
        .post('/profile/add', upload.single('image'))
        .field('name', newTestProfile.name)
        .field('description', newTestProfile.description)
        .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
        .end( async (err, res) => {
          const Profile = new ProfileModel
          await Profile.findOneByName(newTestProfile.name)
          expect(Profile.name).to.equal(newTestProfile.name)
          expect(Profile.description).to.equal(newTestProfile.description)
          done();
        });
    })

    it('Should have created a file', (done) => {
      chai.request(app)
        .post('/profile/add', upload.single('image'))
        .field('name', newTestProfile.name)
        .field('description', newTestProfile.description)
        .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
        .end( async (err, res) => {
          const Profile = new ProfileModel
          await Profile.findOneByName(newTestProfile.name)
          const path = '/var/www/juanportal' + Profile.image
          expect(chaiFile(path)).to.exist
          done()
        });
    })

    it('Should not be allowed to create duplicate profiles', (done) => {
      // Create one profile
      chai.request(app)
        .post('/profile/add', upload.single('image'))
        .field('name', newTestProfile.name)
        .field('description', newTestProfile.description)
        .end((err, res) => {
          // Create a second
          chai.request(app)
            .post('/profile/add', upload.single('image'))
            .field('name', newTestProfile.name)
            .field('description', newTestProfile.description)
            .end( async (err, res) => {
              expect(res.status).to.equal(400)
              // Query the db
              const Profile = new ProfileModel
              const profiles = await Profile.findManyByName(newTestProfile.name)
              expect(profiles).to.have.lengthOf(1)
              const json = JSON.parse(res.text)
              expect(json.success).to.equal(false)
              done();
            });
        });
    })

    afterEach('Remove the test user', async () => {
      const Profile = new ProfileModel
      await Profile.findOneByName(newTestProfile.name)
      const id = Profile._id
      chai.request(app)
        .delete('/profile/id/' + id)
        .end((err, res) => {});
    })
  })

  describe('GET /profile/id/:id', () => {
    it('Should get a profile with a valid id', (done) => {
      // First create a profile
      chai.request(app)
        .post('/profile/add', upload.single('image'))
        .field('name', newTestProfile.name)
        .field('description', newTestProfile.description)
        .end( async (err, res) => {
          // Then get that profile
          const Profile = new ProfileModel
          await Profile.findOneByName(newTestProfile.name)
          expect(Profile).to.have.haveOwnProperty('_id')
          const id = Profile._id
          chai.request(app)
            .get('/profile/id/' + id)
            .end((err, res) => {
              expect(res.status).to.equal(200)
              done();
            });
        });
    })

    it('Should fail when getting a profile with an invalid id', (done) => {
      chai.request(app)
        .get('/profile/id/884hhdd88833hhhhh90889')
        .end((err, res) => {
          expect(res.status).to.equal(404)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(false)
          done();
        });
    })

    afterEach('Remove the test user', async () => {
      const Profile = new ProfileModel
      await Profile.findOneByName(newTestProfile.name)
      const id = Profile._id
      chai.request(app)
        .delete('/profile/id/' + id)
        .end((err, res) => {});
    })

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
})