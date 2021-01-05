import 'mocha'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

const rewire = require('rewire')
const ProfileModel = rewire('../../models/ProfileModel')
const MongooseModel = require('../../schemas/ProfileSchema')
const ProfileController = require('../../controllers/ProfileController')
import { req, res, next } from "../utils"

const mongoose = require('mongoose')
require('dotenv').config()
const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})

const logger = require('../../helpers/logger')
logger.debug = function () {}
logger.info = function () {}

chai.use(chaiAsPromised)
chai.should()

describe('ProfileController', () => {

    describe('Methods', () => {

        const profileData = {
            name: 'TESTPROFILENAME',
            description: 'TESTPROFILEDESCRIPTION',
            image: 'TESTPROFILEIMAGE.jpg'
        }

        async function saveProfileAndFindAndReturnModel () {
            const Profile = new ProfileModel
            const document = new MongooseModel(profileData)
            await document.save()
            await Profile.find({name: profileData.name})
            return Profile
        }

        async function deleteProfile () {
            await MongooseModel.deleteMany({name: profileData.name})
        }

        describe('GetProfileById', function () {

            this.timeout(5000)

            it('Should fail when it cannot parse the id to a number', async () => {
                req.params.id = 'I cannot be parsed to a number'
                const response = await ProfileController.GetProfileById(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('Failed to parse the id to a number')
            })

            it('Should succeed on a valid id', async () => {
                const Profile = await saveProfileAndFindAndReturnModel()
                req.params.id = Profile._id
                const response = await ProfileController.GetProfileById(req, res, next)
                expect(response.statusCode).to.equal(200)
                expect(response.jsonMessage.success).to.equal(true)
                expect(response.jsonMessage.message).to.equal('Successfully got profile')
                expect(response.jsonMessage.data.name).to.equal(Profile.name)
                expect(response.jsonMessage.data.description).to.equal(Profile.description)
                expect(response.jsonMessage.data.image).to.equal(Profile.image)
                await deleteProfile()
            })

            it('Should fail when no profile was found', async () => {
                const validObjectId = mongoose.Types.ObjectId()
                req.params.id = validObjectId
                const response = await ProfileController.GetProfileById(req, res, next)
                expect(response.statusCode).to.equal(404)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('Couldnt find a profile')
            })

        })

        describe('DeleteProfileById', () => {

            it('Should fail when it cannot parse the id to a number', async () => {
                req.params.id = 'I cannot be parsed to a number'
                const response = await ProfileController.DeleteProfileById(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('Failed to parse the id to a number')
            })

            it('Should fail when the profile doesnt exist', async () => {
                req.params.id = mongoose.Types.ObjectId()
                const response = await ProfileController.DeleteProfileById(req, res, next)
                expect(response.statusCode).to.equal(404)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('Profile doesnt exist')
            })

            it('Should delete a profile on valid id', async () => {
                const Profile = await saveProfileAndFindAndReturnModel()
                req.params.id = Profile._id
                const response = await ProfileController.DeleteProfileById(req, res, next)
                expect(response.statusCode).to.equal(200)
                expect(response.jsonMessage.success).to.equal(true)
                expect(response.jsonMessage.message).to.equal('Successfully deleted')
                await deleteProfile()
            })

        })

        describe('GetProfilesByAmount', () => {

            it('Should fail when no param is defined in the URL', async () => {
                req.params.count = null
                const response = await ProfileController.GetProfilesByAmount(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('No count was passed in')
            })

            it('Should fail when it cannot parse the URL parameter to a number', async () => {
                req.params.count = 'i cannot be parsed to a number'
                const response = await ProfileController.GetProfilesByAmount(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('Failed to parse the count to a number')
            })

            it('Should fail when the URL parameter is less than 1', async () => {
                req.params.count = -1
                const response = await ProfileController.GetProfilesByAmount(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('Number of requested profiles did not meet the minimum of 1')
            })

            // skipped because i need to find a tes to test an already populated database if its empty
            it.skip('Should fail when no profiles were found',  async () => {
                req.params.count = 5
                // fixme :: How can I test an already populated database if its empty?
                const response = await ProfileController.GetProfilesByAmount(req, res, next)
                expect(response.statusCode).to.equal(404)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('No profiles were found')
            })

            it('Should succeed when profiles are found', async () => {
                req.params.count = 5
                await saveProfileAndFindAndReturnModel()
                await saveProfileAndFindAndReturnModel()
                await saveProfileAndFindAndReturnModel()
                await saveProfileAndFindAndReturnModel()
                await saveProfileAndFindAndReturnModel()
                const response = await ProfileController.GetProfilesByAmount(req, res, next)
                expect(response.statusCode).to.equal(200)
                expect(response.jsonMessage.success).to.equal(true)
                expect(response.jsonMessage.message).to.equal('Grabbed profiles')
                await deleteProfile()
            })

        })

        describe('PostProfile', () => {

            it('Should fail when the profile already exists', async () => {
                await saveProfileAndFindAndReturnModel()
                req.body.name = profileData.name
                req.body.description = null
                req.file = null
                const response = await ProfileController.PostProfile(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('Profile already exists')
                await deleteProfile()
            })

            it('Should fail when passed in file name has an invalid extension', async () => {
                req.file = {originalname: 'sample'}
                const response = await ProfileController.PostProfile(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('No extension was found')
            })

            it('Should fail when validation fails', async () => {
                // Name
                req.body.name = null
                req.body.description = null
                req.file = null
                let response = await ProfileController.PostProfile(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.data).to.equal('name')
                // todo :: add testting for image file extensions
            })

            it('Should save on a valid profile', async () => {
                req.body.name = profileData.name
                req.body.description = null
                req.file = null
                const response = await ProfileController.PostProfile(req, res, next)
                expect(response.statusCode).to.equal(200)
                expect(response.jsonMessage.success).to.equal(true)
                expect(response.jsonMessage.message).to.equal('Saved the profile')
                const data = response.jsonMessage.data
                const fileName = data.split('.')[0]
                expect(fileName.length).to.equal(36)
            })

        })

    })

})