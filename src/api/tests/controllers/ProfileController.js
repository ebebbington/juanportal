const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

const rewire = require('rewire')
const ProfileModel = rewire('../../models/ProfileModel')
const ProfileController = require('../../controllers/ProfileController')

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

        const req = {
            params: {
                count: null,
                id: null,
            },
            body: {
                name: null,
                description: null
            },
            file: null
        }
        const res = {
            statusCode: null,
            jsonMessage: null,
            status (statusCode) {
                this.statusCode = statusCode
                return this
            },
            json: function (obj) {
                this.jsonMessage = obj
                return this
            },
            end () {
                return this
            }
        }
        const next = function () {
            return true
        }

        const profileData = {
            name: 'TESTPROFILENAME',
            description: 'TESTPROFILEDESCRIPTION',
            image: 'TESTPROFILEIMAGE.jpg'
        }

        describe('GetProfileById', () => {

            it('Should fail when it cannot parse the id to a number', async () => {
                req.params.id = 'I cannot be parsed to a number'
                const response = await ProfileController.GetProfileById(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('Failed to parse the id to a number')
            })

            it('Should succeed on a valid id', async () => {
                const Profile = new ProfileModel
                await Profile.create(profileData)
                req.params.id = Profile._id
                const response = await ProfileController.GetProfileById(req, res, next)
                expect(response.statusCode).to.equal(200)
                expect(response.jsonMessage.success).to.equal(true)
                expect(response.jsonMessage.message).to.equal('Successfully got profile')
                expect(response.jsonMessage.data.name).to.equal(Profile.name)
                expect(response.jsonMessage.data.description).to.equal(Profile.description)
                expect(response.jsonMessage.data.image).to.equal(Profile.image)
                await Profile.deleteOneById(Profile._id)
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
                const Profile = new ProfileModel
                await Profile.create(profileData)
                req.params.id = Profile._id
                const response = await ProfileController.DeleteProfileById(req, res, next)
                expect(response.statusCode).to.equal(200)
                expect(response.jsonMessage.success).to.equal(true)
                expect(response.jsonMessage.message).to.equal('Successfully deleted')
                await Profile.deleteOneById(Profile._id)
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

            it('Should fail when no profiles were found',  async () => {
                req.params.count = 5
                await ProfileModel.deleteAll('Somesuperlongparameterbecauseyouneedtopassoneintothefunctionforittoworkandifyoudontitfailswhichsecuresthefunctionsoifsomeonedidwanttocallthisfunctionthentheyaregoingtohavetocopythisparametertomakeitliterallyimpossibletowriteintoanactuallyapplication')
                const response = await ProfileController.GetProfilesByAmount(req, res, next)
                expect(response.statusCode).to.equal(404)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('No profiles were found')
            })

            it('Should succeed when profiles are found', async () => {
                req.params.count = 5
                const Profile = new ProfileModel
                await Profile.create(profileData)
                await Profile.create(profileData)
                await Profile.create(profileData)
                await Profile.create(profileData)
                await Profile.create(profileData)
                const response = await ProfileController.GetProfilesByAmount(req, res, next)
                expect(response.statusCode).to.equal(200)
                expect(response.jsonMessage.success).to.equal(true)
                expect(response.jsonMessage.message).to.equal('Grabbed profiles')
                await ProfileModel.deleteAllByName(profileData.name) 
            })

        })

        describe('PostProfile', () => {

            it('Should fail when the profile already exists', async () => {
                const Profile = new ProfileModel
                await Profile.create(profileData)
                req.body.name = profileData.name
                req.body.description = null
                req.file = null
                const response = await ProfileController.PostProfile(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.message).to.equal('Profile already exists')
                await Profile.deleteOneById(Profile._id)
            })

            it('Should fail when validation fails', async () => {
                // Name
                req.body.name = null
                req.body.description = null
                req.file = null
                const response = await ProfileController.PostProfile(req, res, next)
                expect(response.statusCode).to.equal(400)
                expect(response.jsonMessage.success).to.equal(false)
                expect(response.jsonMessage.data).to.equal('name')
                // todo :: Image
            })

            it('Should save on a valid profile', async () => {
                req.body.name = profileData.name
                req.body.description = null
                req.file = null
                const response = await ProfileController.PostProfile(req, res, next)
                expect(response.statusCode).to.equal(200)
                expect(response.jsonMessage.success).to.equal(true)
                expect(response.jsonMessage.message).to.equal('Saved the profile')
                expect(response.jsonMessage.data.indexOf('/public/images/')).to.be.greaterThan(-1)
            })

            // Skipped because i dont know how to replicate this, or if it could even ever be triggered
            it('Should fail when the database couldnt be updated')

        })

    })

})