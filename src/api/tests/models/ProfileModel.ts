import 'mocha'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

const rewire = require('rewire')
const ProfileModel = rewire('../../models/ProfileModel')
import BaseModel from '../../models/BaseModel'

const mongoose = require('mongoose')
require('dotenv').config()
const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})

const logger = require('../../helpers/logger')
logger.debug = function () {}
logger.info = function () {}

chai.use(chaiAsPromised)
chai.should()

describe('Profile Model', () => {

    it('Should extend BaseModel', () => {
        const doesExtendBaseModel = ProfileModel.prototype instanceof BaseModel
        expect(doesExtendBaseModel).to.equal(true)
    })

    describe('Properties', () => {

        describe('_id', () => {

            it('Should be defined', () => {
                const Profile = new ProfileModel
                const type = typeof Profile._id
                expect(Profile).to.haveOwnProperty('_id')
            })

        })

        describe('description', () => {

            it('Should be defined', () => {
                const Profile = new ProfileModel
                const type = typeof Profile.description
                expect(Profile).to.haveOwnProperty('description')
            })

        })
        describe('name', () => {

            it('Should be defined', () => {
                const Profile = new ProfileModel
                const type = typeof Profile.name
                expect(Profile).to.haveOwnProperty('_id')
            })

        })
        describe('image', () => {

            it('Should be defined', () => {
                const Profile = new ProfileModel
                const type = typeof Profile.image
                expect(Profile).to.haveOwnProperty('image')
            })

        })
        describe('tablename', () => {

            it('Should be defined', () => {
                const Profile = new ProfileModel
                const type = typeof Profile.tablename
                expect(Profile).to.haveOwnProperty('tablename')
            })

            it('Should equal Profile', () => {
                const Profile = new ProfileModel
                expect(Profile.tablename).to.equal('Profile')
            })

        })

        describe('fieldsToExpose', () => {

            it('Should be defined', () => {
                const Profile = new ProfileModel
                expect(Array.isArray(Profile.fieldsToExpose)).to.equal(true)
                expect(Profile).to.haveOwnProperty('fieldsToExpose')
            })

            it('Should expose the correct properties', () => {
                const Profile = new ProfileModel
                const fieldsToExpose = ['_id', 'name', 'description', 'image']
                Profile.fieldsToExpose.forEach((val: string) => {
                    const isIncluded = fieldsToExpose.includes(val)
                    expect(isIncluded).to.equal(true)
                })
            })

        })

    })

    describe('Methods', () => {

        const profileData = {
            name: 'TESTPROFILENAME',
            description: 'TESTPROFILEDESCRIPTION',
            image: 'TESTPROFILEIMAGE.jpeg'
        }

        /* Commented out after i moved this method into the BaseModel on 26/12/2019 and want to retain the expectations */
        // describe('`create`', function () {

        //     it('Should fill the model on a successful creation', async () => {
        //         const Profile = new ProfileModel
        //         const errors = await Profile.create(profileData)
        //         expect(errors).to.not.exist
        //         expect(Profile.name).to.equal(profileData.name)
        //         expect(Profile.description).to.equal(profileData.description)
        //         expect(Profile.image).to.equal(profileData.image)
        //     })

        //     it('Should create a profile with valid params', async () => {
        //         const Profile = new ProfileModel
        //         const errors = await Profile.create(profileData)
        //         expect(errors).to.not.exist
        //         await Profile.findOneByName(profileData.name)
        //         expect(Profile.name).to.equal(profileData.name)
        //     })

        //     it('Should fail validation when a name isnt passed in', async () => {
        //         const Profile = new ProfileModel
        //         const data = {
        //             description: profileData.description,
        //             image: profileData.image
        //         }
        //         const errors = await Profile.create(data)
        //         expect(errors).to.exist
        //         expect(errors.errors).to.haveOwnProperty('name')  
        //     })

        //     it('Should pass validation when description isnt passed in', async () => {
        //         const Profile = new ProfileModel
        //         const data = {
        //             name: profileData.name,
        //             image: profileData.image
        //         }
        //         const errors = await Profile.create(data)
        //         expect(errors).to.not.exist
        //         expect(Profile.name).to.equal(data.name)
        //         expect(Profile.description).to.equal(data.description)
        //         expect(Profile.image).to.equal(data.image)
        //     })

        //     it('Should fail validation when no image is passed in', async () => {
        //         const Profile = new ProfileModel
        //         const data = {
        //             name: profileData.name,
        //             description: profileData.description
        //         }
        //         const errors = await Profile.create(data)
        //         expect(errors).to.exist
        //         expect(errors.errors).to.haveOwnProperty('image')  
        //     })

        //     it('Should pass validation with the correct file extensions', async () => {
        //         const Profile = new ProfileModel
        //         const supportedExtensions = [
        //             '.jpg',
        //             '.png',
        //             '.PNG',
        //             '.JPG',
        //             '.JPEG',
        //             '.jpeg'
        //         ]
        //         const data = {
        //             name: profileData.name,
        //             description: profileData.description,
        //             image: 'TESTPROFILEIMAGE'
        //         }
        //         let errors

        //         // .jpg
        //         data.image = data.image + supportedExtensions[0]
        //         errors = await Profile.create(data)
        //         expect(errors).to.not.exist
        //         let success = await Profile.deleteOneByName(data.name)
        //         expect(success).to.equal(true)

        //         // .png
        //         data.image = data.image + supportedExtensions[1]
        //         errors = await Profile.create(data)
        //         expect(errors).to.not.exist
        //         success = await Profile.deleteOneByName(data.name)
        //         expect(success).to.equal(true)

        //         // .PNG
        //         data.image = data.image + supportedExtensions[1]
        //         errors = await Profile.create(data)
        //         expect(errors).to.not.exist
        //         success = await Profile.deleteOneByName(data.name)
        //         expect(success).to.equal(true)

        //         // .JPG
        //         data.image = data.image + supportedExtensions[2]
        //         errors = await Profile.create(data)
        //         expect(errors).to.not.exist
        //         success = await Profile.deleteOneByName(data.name)
        //         expect(success).to.equal(true)

        //         // .JPEG
        //         data.image = data.image + supportedExtensions[3]
        //         errors = await Profile.create(data)
        //         expect(errors).to.not.exist
        //         success = await Profile.deleteOneByName(data.name)
        //         expect(success).to.equal(true)

        //         // .jpeg
        //         data.image = data.image + supportedExtensions[4]
        //         errors = await Profile.create(data)
        //         expect(errors).to.not.exist
        //         success = await Profile.deleteOneByName(data.name)
        //         expect(success).to.equal(true)

        //         // supportedExtensions.forEach( async (extension) => {
        //         //     data.image = 'TESTPROFILEIMAGE' + extension
        //         //     const errors = await Profile.create(data)
        //         //     expect(errors).to.not.exist
        //         // })
        //     })

        //     afterEach( async () => {
        //         const Profile = new ProfileModel
        //         const success = await Profile.deleteOneByName(profileData.name)
        //         expect(success).to.equal(true)
        //         //await Profile.deleteOneById(profileData._id)
        //     })

        // })

        describe('getMongooseModel', () => {

            it('Should exist and return the Mongoose Model', () => {
                const Profile = new ProfileModel
                const MongooseModel = Profile.getMongooseModel()
                expect(MongooseModel).to.exist
            })

        })

    })
    
})