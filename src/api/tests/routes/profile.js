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

logger.debug = function (){}
logger.info = function (){}

const chaiFile = chaiFiles.file
chai.use(chaiAsPromised)
chai.use(chaiHttp)
chai.should()



// turn off logging
// logger.info = function (a) {}
// logger.debug = function (e) {}

describe.only('Profile Route', () => {

    describe('GET /profile/count/:count', () => {
      it('Should respond with a 200 status', (done) => {
        chai.request(app)
          .get('/api/profile/count/5')
          .end((err, res) => {
            expect(res.status).to.equal(200)
            done()
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
        // First we are going to get how many profiles exist
        const Profile = new ProfileModel
        const numberOfProfilesToFind = 400
        const profiles = await Profile.findManyByCount(numberOfProfilesToFind)
        // Check if we got many profiles, else a single profile will be retirved, and as we cant check a length on that, we check the props to determine if even a single result came back
        const actualNumberOfProfiles = profiles.length || profiles._id ? 1 : 0
        // then we are going to compare that number with the real result
        chai.request(app)
        .get('/api/profile/count/' + numberOfProfilesToFind)
        .end((err, res) => {
          const json = JSON.parse(res.text)
          // So here it's a fix to get the amount of profiles whether an array or single object (one profile) was given back
          expect(json.data.length || json.data._id ? 1 : 0).to.equal(actualNumberOfProfiles)
        })
      })
      it('Should respond with a 404 status on no profiles found')
    })
    describe.only('GET /profile/id/:id', () => {
      it.only('Should have valid values for the profile', async () => {
        const Profile = new ProfileModel
        await Profile.findOneByName('edward')
        chai.request(app)
        .get('/api/profile/id/' + Profile._id)
        .end((err, res) => {
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(true)
          expect(json.data._id).to.exist
        })
      })
      it('Should respond with 200 on a valid profile', async () => {
        const Profile = new ProfileModel
        await Profile.findOneByName('edward')
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
    })
    describe('DELETE /profile/id/:id', function () {
      this.timeout(5000)
      it('Should delete a valid profile', async () => {
        const Profile = new ProfileModel
        await Profile.findOneByName('edward')
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
            expect(res.status).to.equal(500)
            expect(json.success).to.equal(false)
            done()
          })
      })
    })
    describe.only('POST /profile', function () {
      this.timeout(5000)
      it('Should succedd with valid data, and update the database', (done) => {
        chai.request(app)
          .post('/api/profile', upload.single('image'))
          .field('name', 'king tut')
          .field('description', 'hello')
          .attach('image', fs.readFileSync('/var/www/api/sample.jpg'), 'sample.jpg')
          .end( async (err, res) => {
            expect(res.status).to.equal(200)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(true)
            // and as it passes back the immage name
            expect(json.data).to.exist
            expect(typeof json.data).to.equal('string')
            const Profile = new ProfileModel
            await Profile.findOneByName('king tut')
            expect(Profile.name).to.equal('king tut')
            done()
          });
      })
      it('Should fail is the name fails validation', (done) => {
        chai.request(app)
          .post('/api/profile', upload.single('image'))
          .field('name', '')
          .field('description', 'hello')
          .attach('image', fs.readFileSync('/var/www/api/sample.jpg'), 'sample.jpg')
          .end((err, res) => {
            expect(res.status).to.equal(400)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(false)
            expect(json.data).to.equal('name')
            done()
          });
      })
      it('Should pass if no description is given', (done) => {
        chai.request(app)
          .post('/api/profile', upload.single('image'))
          .field('name', 'king tut')
          .field('description', '')
          .attach('image', fs.readFileSync('/var/www/api/sample.jpg'), 'sample.jpg')
          .end( async (err, res) => {
            expect(res.status).to.equal(200)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(true)
            // and as it passes back the immage name
            expect(json.data).to.exist
            expect(typeof json.data).to.equal('string')
            const Profile = new ProfileModel
            await Profile.findOneByName('king tut')
            expect(Profile.name).to.equal('king tut')
            done()
          });
      })
      it('Should fail is image fails validation', (done) => {
        chai.request(app)
          .post('/api/profile', upload.single('image'))
          .field('name', 'king tut')
          .field('description', 'hello')
          .attach('image', fs.readFileSync('/var/www/api/sample.jpg'), 'sample')
          .end((err, res) => {
            expect(res.status).to.equal(400)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(false)
            // and as it passes back the immage name
            expect(json.data).to.equal('image')
            done()
          });
      })
      it('Should pass if no image is given', () => {
        chai.request(app)
          .post('/api/profile')
          .field('name', 'king tut')
          .field('description', 'hello')
          .end( async (err, res) => {
            expect(res.status).to.equal(200)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(true)
            expect(json.data).to.exist
            expect(typeof json.data).to.equal('string')
            const Profile = new ProfileModel
            await Profile.findOneByName('king tut')
            expect(Profile.name).to.equal('king tut')
          });
      })
      it('Should fail if the user already exists', (done) => {
        console.log('posting 1st one')
        chai.request(app)
          .post('/api/profile', upload.single('image'))
          .field('name', 'king tut')
          .field('description', 'hello')
          .attach('image', fs.readFileSync('/var/www/api/sample.jpg'), 'sample.jpg')
          .end( async (err, res) => {
            expect(res.status).to.equal(200)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(true)
            // and as it passes back the immage name
            expect(json.data).to.exist
            expect(typeof json.data).to.equal('string')
            const Profile = new ProfileModel
            await Profile.findOneByName('king tut')
            expect(Profile.name).to.equal('king tut')
            console.log('posting 2nd one')
            chai.request(app)
              .post('/api/profile', upload.single('image'))
              .field('name', 'king tut')
              .field('description', 'hello')
              .attach('image', fs.readFileSync('/var/www/api/sample.jpg'), 'sample.jpg')
              .end((err, res) => {
                expect(res.status).to.equal(400)
                const json = JSON.parse(res.text)
                expect(json.success).to.equal(false)
                done()
              });
          });
      })
      afterEach('Remove the test user', async () => {
              const Profile = new ProfileModel
              await Profile.findOneByName('king tut')
              const id = Profile._id
              chai.request(app)
                .delete('/api/profile/id/' + id)
                .end((err, res) => {});
            })
    })
})

// describe('Profile Route', () => {

//   const newTestProfile = {
//     name: 'Super wierd odd test account name',
//     description: 'Hello world',
//     image: function () {
//       return fs.readFile('../../public/images/sample.jpg', (data) => {
//         return data
//       })
//     }
//   }

//   /**
//    * POST /profile/add
//    *
//    * Test adding a user, which we will also use further down
//    */
//   describe('POST /profile/add', function () {
//     this.timeout(5000)
  
//     it('Should respond with a 200 with valid data', (done) => {
//       chai.request(app)
//         .post('/profile/add', upload.single('image'))
//         .field('name', newTestProfile.name)
//         .field('description', newTestProfile.description)
//         .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
//         .end((err, res) => {
//           expect(res.status).to.equal(200)
//           done()
//         });
//     })

//     it('Should fail when name doesnt meet validation', (done) => {
//       chai.request(app)
//         .post('/profile/add', upload.single('image'))
//         .field('name', 'a')
//         .field('description', newTestProfile.description)
//         .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
//         .end((err, res) => {
//           expect(res.status).to.equal(400)
//           const json = JSON.parse(res.text)
//           expect(json.success).to.equal(false)
//           expect(json.message).to.have.haveOwnProperty('name')
//           done();
//         });
//     })

//     it('Should pass when no description is passed in', (done) => {
//       chai.request(app)
//       .post('/profile/add', upload.single('image'))
//       .field('name', newTestProfile.name)
//       .field('description', '')
//       .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
//       .end((err, res) => {
//         expect(res.status).to.equal(200)
//         done();
//       });
//     })

//     it('Should fail when image doesnt meet validation', (done) => {
//       chai.request(app)
//         .post('/profile/add', upload.single('image'))
//         .field('name', newTestProfile.name)
//         .field('description', newTestProfile.description)
//         .attach('image', fs.readFileSync('/var/www/juanportal/public/images/test.txt'), 'test.txt')
//         .end((err, res) => {
//           expect(res.status).to.equal(400)
//           const json = JSON.parse(res.text)
//           expect(json.success).to.equal(false)
//           expect(json.message).to.have.haveOwnProperty('image')
//           done();
//         });
//     })

//     it('Should pass when no image is passed in', (done) => {
//       chai.request(app)
//         .post('/profile/add', upload.single('image'))
//         .field('name', newTestProfile.name)
//         .field('description', newTestProfile.description)
//         .end((err, res) => {
//           expect(res.status).to.equal(200)
//           done();
//         });
//     })

//     it('Should have saved the user', (done) => {
//       chai.request(app)
//         .post('/profile/add', upload.single('image'))
//         .field('name', newTestProfile.name)
//         .field('description', newTestProfile.description)
//         .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
//         .end( async (err, res) => {
//           const Profile = new ProfileModel
//           await Profile.findOneByName(newTestProfile.name)
//           expect(Profile.name).to.equal(newTestProfile.name)
//           expect(Profile.description).to.equal(newTestProfile.description)
//           done();
//         });
//     })

//     it('Should have created a file', (done) => {
//       chai.request(app)
//         .post('/profile/add', upload.single('image'))
//         .field('name', newTestProfile.name)
//         .field('description', newTestProfile.description)
//         .attach('image', fs.readFileSync('/var/www/juanportal/public/images/sample.jpg'), 'sample.jpg')
//         .end( async (err, res) => {
//           const Profile = new ProfileModel
//           await Profile.findOneByName(newTestProfile.name)
//           const path = '/var/www/juanportal' + Profile.image
//           expect(chaiFile(path)).to.exist
//           done()
//         });
//     })

//     it('Should not be allowed to create duplicate profiles', (done) => {
//       // Create one profile
//       chai.request(app)
//         .post('/profile/add', upload.single('image'))
//         .field('name', newTestProfile.name)
//         .field('description', newTestProfile.description)
//         .end((err, res) => {
//           // Create a second
//           chai.request(app)
//             .post('/profile/add', upload.single('image'))
//             .field('name', newTestProfile.name)
//             .field('description', newTestProfile.description)
//             .end( async (err, res) => {
//               expect(res.status).to.equal(400)
//               // Query the db
//               const Profile = new ProfileModel
//               const profiles = await Profile.findManyByName(newTestProfile.name)
//               expect(profiles).to.have.lengthOf(1)
//               const json = JSON.parse(res.text)
//               expect(json.success).to.equal(false)
//               done();
//             });
//         });
//     })

//     afterEach('Remove the test user', async () => {
//       const Profile = new ProfileModel
//       await Profile.findOneByName(newTestProfile.name)
//       const id = Profile._id
//       chai.request(app)
//         .delete('/profile/id/' + id)
//         .end((err, res) => {});
//     })
//   })

//   describe('GET /profile/id/:id', () => {
//     it('Should get a profile with a valid id', (done) => {
//       // First create a profile
//       chai.request(app)
//         .post('/profile/add', upload.single('image'))
//         .field('name', newTestProfile.name)
//         .field('description', newTestProfile.description)
//         .end( async (err, res) => {
//           // Then get that profile
//           const Profile = new ProfileModel
//           await Profile.findOneByName(newTestProfile.name)
//           expect(Profile).to.have.haveOwnProperty('_id')
//           const id = Profile._id
//           chai.request(app)
//             .get('/profile/id/' + id)
//             .end((err, res) => {
//               expect(res.status).to.equal(200)
//               done();
//             });
//         });
//     })

//     it('Should fail when getting a profile with an invalid id', (done) => {
//       chai.request(app)
//         .get('/profile/id/884hhdd88833hhhhh90889')
//         .end((err, res) => {
//           expect(res.status).to.equal(404)
//           const json = JSON.parse(res.text)
//           expect(json.success).to.equal(false)
//           done();
//         });
//     })

//     afterEach('Remove the test user', async () => {
//       const Profile = new ProfileModel
//       await Profile.findOneByName(newTestProfile.name)
//       const id = Profile._id
//       chai.request(app)
//         .delete('/profile/id/' + id)
//         .end((err, res) => {});
//     })

//   })

//   describe('GET /profile/add', () => {
//     it('Should respond with a 200', (done) => {
//       chai.request(app)
//       .get('/profile/add')
//       .end((err, res) => {
//         expect(res.status).to.equal(200)
//         done();
//       });
//     })
//   })

//   describe('DELETE /profile/id/:id', () => {
//     it('Should respond with 200 on valid profile', async () => {
//       const Profile = new ProfileModel
//       const newProfile = Profile.create({
//         name: newTestProfile.name,
//         image: '/public/images/teeeeet.png'
//       })
//       const saved = Profile.insertOne(newProfile)
//       await Profile.findOneByName(newTestProfile.name)
//       expect(Profile._id).to.exist
//       const id = Profile._id
//       chai.request(app)
//         .delete('/profile/id/' + id)
//         .end(async (err, res) => {
//           expect(res.status).to.equal(200)
//           const json = JSON.parse(res.text)
//           expect(json.success).to.equal(true)

//         });

//     })
//     it('Should not respond with 404 on invalid profile', (done) => {
//       chai.request(app)
//         .delete('/profile/id/4748745hu4uhg48')
//         .end((err, res) => {
//           expect(res.status).to.equal(404)
//           const json = JSON.parse(res.text)
//           expect(json.success).to.equal(false)
//           done()
//         });
//     })
//     it('Should have removed the profile', async () => {
//       const Profile = new ProfileModel
//       const newProfile = Profile.create({
//         name: newTestProfile.name,
//         image: '/public/images/teeeeet.png'
//       })
//       const saved = Profile.insertOne(newProfile)
//       await Profile.findOneByName(newTestProfile.name)
//       expect(Profile._id).to.exist
//       const id = Profile._id
//       chai.request(app)
//         .delete('/profile/id/' + id)
//         .end(async (err, res) => {
//           expect(res.status).to.equal(200)
//           const json = JSON.parse(res.text)
//           expect(json.success).to.equal(true)
//           await Profile.findOneByName(newTestProfile.name)
//           expect(Profile._id).to.equal('')
//           expect(Profile.name).to.equal('')
//           expect(Profile.description).to.equal('')
//           expect(Profile.name).to.equal('')
//         });
//     })
//     it('Should have removed the file from the filesystem', async () => {
//       const Profile = new ProfileModel
//       const newProfile = Profile.create({
//         name: newTestProfile.name,
//         image: '/public/images/teeeeet.png'
//       })
//       const saved = Profile.insertOne(newProfile)
//       await Profile.findOneByName(newTestProfile.name)
//       expect(Profile._id).to.exist
//       const id = Profile._id
//       chai.request(app)
//         .delete('/profile/id/' + id)
//         .end((err, res) => {
//           expect(res.status).to.equal(200)
//           const json = JSON.parse(res.text)
//           expect(json.success).to.equal(true)
//           const path = '/var/www/juanportal' + Profile.image
//           const exists = fs.existsSync(path)
//           expect(exists).to.equal(false)
//         });
//     })

//     afterEach('Remove the test user', async () => {
//       const Profile = new ProfileModel
//       await Profile.findOneByName(newTestProfile.name)
//       const id = Profile._id
//       chai.request(app)
//         .delete('/profile/id/' + id)
//         .end((err, res) => {});
//     })
//   })
// })