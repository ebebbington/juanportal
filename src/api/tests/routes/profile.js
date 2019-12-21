const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('../../app')
const chaiHttp = require('chai-http')
const ProfileModel = require('../../models/ProfileModel')
const fs = require('fs')
const util = require('util')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const logger = require('../../helpers/logger')
//logger.debug = function (){}
//logger.info = function (){}

chai.use(chaiAsPromised)
chai.use(chaiHttp)
chai.should()

describe('Profile Route', () => {

    describe('GET /api/profile/count/:count', () => {

      it('Should fail when the parameter cannot be parsed as a number', (done) => {
        chai.request(app)
          .get('/api/profile/count/hello')
          .end((err, res) => {
            expect(res.status).to.equal(400)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(false)
            done()
          })
      })

      it('Should respond with a 200 status', async () => {
        // add a profile
        const newProfile = {
          name: 'TESTPROFILENAME',
          image: 'TESTPROFILEIMAGE.jpg'
        }
        const Profile = new ProfileModel
        await Profile.create(newProfile)
        chai.request(app)
          .get('/api/profile/count/5')
          .end((err, res) => {
            expect(res.status).to.equal(200)
          })
      })

      it('Should return nothing if count is less than 1', (done) => {
        chai.request(app)
          .get('/api/profile/count/0')
          .end((err, res) => {
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(false)
            expect(res.status).to.equal(400)
            done()
          })
      })

      it('Should respond with the specified number of profiles if they exist', async () => {
        console.warn('This test assumes there is only 1 profile')
        const Profile = new ProfileModel
        await Profile.create({name: 'TESTPROFILENAME', image: 'TESTPROFILEIMAGE.jpg'})
        const numberOfProfilesToFind = 400
        const profiles = await ProfileModel.findManyByCount(numberOfProfilesToFind)
        // Check if we got many profiles, else a single profile will be retirved, and as we cant check a length on that, we check the props to determine if even a single result came back
        const actualNumberOfProfiles = profiles.length || profiles._id ? 1 : 0 || 0
        const hasProfiles = actualNumberOfProfiles ? true : false
        expect(hasProfiles).to.equal(true) // some profiles should already exist when running this
        // then we are going to compare that number with the real result
        chai.request(app)
          .get('/api/profile/count/' + numberOfProfilesToFind)
          .end((err, res) => {
            const json = JSON.parse(res.text)
            // So here it's a fix to get the amount of profiles whether an array or single object (one profile) was given back
            expect(json.data.length || json.data._id ? 1 : 0).to.equal(actualNumberOfProfiles)
          })
      })

      it('Should respond with a 404 status on no profiles found', async () => {
        // Super long param to stop dodgey use of it
        await ProfileModel.deleteAll('Somesuperlongparameterbecauseyouneedtopassoneintothefunctionforittoworkandifyoudontitfailswhichsecuresthefunctionsoifsomeonedidwanttocallthisfunctionthentheyaregoingtohavetocopythisparametertomakeitliterallyimpossibletowriteintoanactuallyapplication')
        chai.request(app)
          .get('/api/profile/count/6')
          .end((err, res) => {
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(false)
            expect(res.status).to.equal(404)
          })
      })

    })

    describe('GET /profile/id/:id', () => {
       
      const newProfile = {
        name: 'TESTPROFILENAME',
        description: 'TESTPROFILEDESCRIPTION',
        image: 'TESTPROFILEIMAGE.jpg'
      }

      before('Create test profile', async () => {
        const Profile = new ProfileModel
        await Profile.create(newProfile)
      })

      it('Should fail when the id cannot be parsed', (done) => {
        chai.request(app)
        .get('/api/profile/id/hello')
        .end((err, res) => {
          expect(res.status).to.equal(400)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(false)
          done()
        })
      })

      it('Should have valid values for the profile', async () => {
        const Profile = new ProfileModel
        await Profile.create(newProfile)
        await Profile.findOneByName(newProfile.name)
        chai.request(app)
        .get('/api/profile/id/' + Profile._id)
        .end(async (err, res) => {
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(true)
          expect(json.data._id).to.exist
        })
      })

      it('Should respond with 200 on a valid profile', async () => {
        const Profile = new ProfileModel
        await Profile.findOneByName(newProfile.name)
        chai.request(app)
        .get('/api/profile/id/' + Profile._id)
        .end((err, res) => {
          expect(res.status).to.equal(200)
        })
      })

      it('Should respond with 404 if no profile was found', (done) => {
        chai.request(app)
        .get('/api/profile/id/' + '8949549n848n94n899897b788n8gyhghyi7878')
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(JSON.parse(res.text).success).to.equal(false)
          done()
        })
      })

      after('Remove test profile', async function () {
        this.timeout(5000)
        const Profile = new ProfileModel
        await Profile.deleteOneByName(newProfile.name)
      })

    })

    describe('DELETE /profile/id/:id', function () {

      this.timeout(5000)

      it('Should fail when the id cannot be parsed', (done) => {
        chai.request(app)
        .delete('/api/profile/id/hello')
        .end((err, res) => {
          expect(res.status).to.equal(400)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(false)
          done()
        })
      })

      it('Should delete a valid profile', async () => {
        const Profile = new ProfileModel
        const newProfile = {
          name: 'TESTPROFILENAME',
          description: 'TESTPROFILEDESCRIPTION',
          image: 'TESTPROFILEIMAGE.jpg'
        }
        await Profile.create(newProfile)
        await Profile.findOneByName(newProfile.name)
        chai.request(app)
        .delete('/api/profile/id/' + Profile._id)
        .end((err, res) => {
          const json = JSON.parse(res.text)
          expect(res.status).to.equal(200)
          expect(json.success).to.equal(true)
        })
      })

      it('Should fail on an invalid profile', (done) => {
        chai.request(app)
          .delete('/api/profile/id/4h89g58h9g589h89g589hg5h98g598g589h')
          .end((err, res) => {
            const json = JSON.parse(res.text)
            expect(res.status).to.equal(404)
            expect(json.success).to.equal(false)
            done()
          })
      })
    })

    describe('POST /profile', function () {

      const sampleImagePath = '/var/www/api/sample.jpg'

      const newProfile = {
        name: 'TESTPROFILENAME',
        description: 'TESTPROFILEDESCRIPTION',
        image: 'TESTPROFILEIMAGE.jpg'
      }

      it('Should succeed with valid data, and update the database', async () => {
        await ProfileModel.deleteAllByName(newProfile.name)
        chai.request(app)
          .post('/api/profile', upload.single('image'))
          .field('name', newProfile.name)
          .field('description', newProfile.description)
          .attach('image', fs.readFileSync(sampleImagePath), newProfile.image)
          .end( async (err, res) => {
            expect(res.status).to.equal(200)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(true)
            expect(json.data).to.exist
            expect(typeof json.data).to.equal('string')
            const Profile = new ProfileModel
            await Profile.findOneByName(newProfile.name)
            expect(Profile.name).to.equal(newProfile.name)
            await ProfileModel.deleteAllByName(newProfile.name)
          });
      })

      it('Should fail is the name fails validation', async () => {
        await ProfileModel.deleteAllByName(newProfile.name)
        chai.request(app)
          .post('/api/profile', upload.single('image'))
          .field('name', '')
          .field('description', newProfile.description)
          .attach('image', fs.readFileSync(sampleImagePath), newProfile.image)
          .end( async (err, res) => {
            expect(res.status).to.equal(400)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(false)
            expect(json.data).to.equal('name')
          });
      })

      it('Should pass if no description is given', async () => {
        await ProfileModel.deleteAllByName(newProfile.name)
        chai.request(app)
          .post('/api/profile', upload.single('image'))
          .field('name', newProfile.name)
          .field('description', '')
          .attach('image', fs.readFileSync(sampleImagePath), newProfile.image)
          .end( async (err, res) => {
            expect(res.status).to.equal(200)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(true)
            expect(json.data).to.exist
            expect(typeof json.data).to.equal('string')
            const Profile = new ProfileModel
            await Profile.findOneByName(newProfile.name)
            expect(Profile.name).to.equal(newProfile.name)
            const success = await Profile.deleteOneByName(newProfile.name)
            expect(success).to.equal(true)
            await ProfileModel.deleteAllByName(newProfile.name)
          });
      })

      // fixme :: some reason, a profile already exists when this block is executed
      it('Should fail is image fails validation', async () => {
        await ProfileModel.deleteAllByName(newProfile.name)
        chai.request(app)
          .post('/api/profile', upload.single('image'))
          .field('name', newProfile.name)
          .field('description', newProfile.description)
          .attach('image', fs.readFileSync(sampleImagePath), 'sample')
          .end( async (err, res) => {
            expect(res.status).to.equal(400)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(false)
            expect(json.data).to.equal('image')
          });
      })

      it('Should pass if no image is given', () => {
        chai.request(app)
          .post('/api/profile')
          .field('name', newProfile.name)
          .field('description', newProfile.description)
          .end( async (err, res) => {
            expect(res.status).to.equal(200)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(true)
            expect(json.data).to.exist
            expect(typeof json.data).to.equal('string')
            const Profile = new ProfileModel
            await Profile.findOneByName(newProfile.name)
            expect(Profile.name).to.equal(newProfile.name)
            const success = await Profile.deleteOneByName(newProfile.name)
            expect(success).to.equal(true)
            await ProfileModel.deleteAllByName(newProfile.name)
          });
      })

      it('Should fail if the user already exists', async () => {
        const Profile = new ProfileModel
        await Profile.create(newProfile)
        chai.request(app)
          .post('/api/profile', upload.single('image'))
          .field('name', newProfile.name)
          .field('description', newProfile.description)
          .attach('image', fs.readFileSync(sampleImagePath), newProfile.image)
          .end((err, res) => {
            expect(res.status).to.equal(400)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(false)
          })
      })

    })

})