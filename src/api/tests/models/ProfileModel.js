const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

const rewire = require('rewire')
const ProfileModel = rewire('../../models/ProfileModel')

const mongoose = require('mongoose')
require('dotenv').config()
const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})

chai.use(chaiAsPromised)
chai.should()

describe('Profile Model', () => {
    describe('Properties', () => {
        describe('_id', () => {
            it('Should be defined', () => {
                const Profile = new ProfileModel
                const type = typeof Profile._id
                expect(type).to.equal('string')
                expect(Profile).to.haveOwnProperty('_id')
            })
        })
        describe('description', () => {
            it('Should be defined', () => {
                const Profile = new ProfileModel
                const type = typeof Profile.description
                expect(type).to.equal('string')
                expect(Profile).to.haveOwnProperty('description')
            })
        })
        describe('name', () => {
            it('Should be defined', () => {
                const Profile = new ProfileModel
                const type = typeof Profile.name
                expect(type).to.equal('string')
                expect(Profile).to.haveOwnProperty('_id')
            })
        })
        describe('image', () => {
            it('Should be defined', () => {
                const Profile = new ProfileModel
                const type = typeof Profile.image
                expect(type).to.equal('string')
                expect(Profile).to.haveOwnProperty('image')
            })
        })
        describe('tablename', () => {
            it('Should be defined', () => {
                const Profile = new ProfileModel
                const type = typeof Profile.tablename
                expect(type).to.equal('string')
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
                Profile.fieldsToExpose.forEach(val => {
                    const isIncluded = fieldsToExpose.includes(val)
                    expect(isIncluded).to.equal(true)
                });
            })
        })
    })
    describe.only('Methods', () => {
        const profileData = {
            name: 'TESTPROFILENAME',
            description: 'TESTPROFILEDESCRIPTION',
            image: 'TESTPROFILEIMAGE.jpg'
        }
        describe.only('`create`', function () {
            it('Should fill the model on a successful creation', async () => {
                const Profile = new ProfileModel
                const errors = await Profile.create(profileData)
                expect(errors).to.not.exist
                expect(Profile.name).to.equal(profileData.name)
                expect(Profile.description).to.equal(profileData.description)
                expect(Profile.image).to.equal(profileData.image)
            })
            it('Should create a profile with valid params', async () => {
                const Profile = new ProfileModel
                const errors = await Profile.create(profileData)
                expect(errors).to.not.exist
                await Profile.findOneByName(profileData.name)
                expect(Profile.name).to.equal(profileData.name)
            })
            it('Should fail validation when a name isnt passed in', async () => {
                const Profile = new ProfileModel
                const data = {
                    description: profileData.description,
                    image: profileData.image
                }
                const errors = await Profile.create(data)
                expect(errors).to.exist
                expect(errors.errors).to.haveOwnProperty('name')  
            })
            it('Should pass validation when description isnt passed in', async () => {
                const Profile = new ProfileModel
                const data = {
                    name: profileData.name,
                    image: profileData.image
                }
                const errors = await Profile.create(data)
                expect(errors).to.not.exist
                expect(Profile.name).to.equal(data.name)
                expect(Profile.description).to.equal(data.description)
                expect(Profile.image).to.equal(data.image)
            })
            it('Should fail validation when no image is passed in', async () => {
                const Profile = new ProfileModel
                const data = {
                    name: profileData.name,
                    description: profileData.description
                }
                const errors = await Profile.create(data)
                expect(errors).to.exist
                expect(errors.errors).to.haveOwnProperty('image')  
            })
            it('Should pass validation with the correct file extensions', async () => {
                const Profile = new ProfileModel
                const supportedExtensions = [
                    '.jpg',
                    '.png',
                    '.PNG',
                    '.JPG',
                    '.JPEG',
                    '.jpeg'
                ]
                const data = {
                    name: profileData.name,
                    description: profileData.description,
                    image: 'TESTPROFILEIMAGE'
                }
                supportedExtensions.forEach( async (extension) => {
                    data.image = 'TESTPROFILEIMAGE' + extension
                    const errors = await Profile.create(data)
                    expect(errors).to.not.exist
                })
            })
            afterEach( async () => {
                ProfileModel.deleteAllByName(profileData.name)
            })
        })
        describe('`findOneById`', function () {
            before( async () => {
                const Profile = new ProfileModel
                await Profile.create(profileData)
            })
            it('Should fill the model on a successfil find', async () => {
                const Profile = new ProfileModel
                await Profile.findOneByName(profileData.name)
                expect(Profile.name).to.equal(profileData.name)
                expect(Profile.description).to.equal(profileData.description)
                expect(Profile.image).to.equal(profileData.image)
            })
            // not sure why this takes so long
            it('Should return a profile on valid id', async () => {
                const Profile = new ProfileModel
                await Profile.findOneByName(profileData.name)
                expect(Profile._id).to.exist
                await Profile.findOneById(Profile._id)
                expect(Profile.name).to.equal(profileData.name)
                expect(Profile.description).to.equal(profileData.description)
                expect(Profile.image).to.equal(profileData.image)
            })
            it('Should return an empty array in invalid data', async () => {
                const Profile = new ProfileModel
                await Profile.findOneById('jhjhjhjhjkjjk')
                expect(Profile._id).to.equal('')
                expect(Profile.name).to.equal('')
                expect(Profile.description).to.equal('')
                expect(Profile.image).to.equal('')
            })
            afterEach( async () => {
                const Profile = new ProfileModel
                await Profile.deleteOneByName(profileData.name)
            })
        })
        describe('`deleteOneById`', () => {
            beforeEach(async () => {
                const Profile = new ProfileModel
                await Profile.create(profileData)
            })
            it('Should delete a profile on valid id', async () => {
                const Profile = new ProfileModel
                await Profile.findOneByName(profileData.name)
                expect(Profile._id).to.exist
                await Profile.deleteOneById(Profile._id)
                expect(Profile._id).to.equal('')
                expect(Profile.name).to.equal('')
                expect(Profile.description).to.equal('')
                expect(Profile.image).to.equal('')
                await Profile.findOneByName(profileData.name)
                expect(Profile._id).to.equal('')
            })
            it('Should fail on an invalid id', async () => {
                const Profile = new ProfileModel
                const success = await Profile.findOneById('45854895498')
                expect(success).to.equal(false)
                expect(Profile._id).to.equal('')
            })
        })
        describe('`deleteManyById`', () => {
            
        })
        describe('`deleteOneByName`', function () {
            this.timeout(20000)
            it('Should remove a single model with a valid name', async () => {
                const profileData = {
                    name: 'Eduardo Bebbingtano',
                    image: 'nope.jpg'
                }
                const Profile = new ProfileModel
                // first check it doesnt exist
                await Profile.findOneByName(profileData.name)
                expect(Profile._id).to.equal('')
                // Create the profile and make sure it worked
                await Profile.create(profileData)
                expect(Profile.name).to.equal(profileData.name)
                // Make sure the db was updated
                await Profile.findOneByName(profileData.name)
                expect(Profile.name).to.equal(profileData.name)
                // Delete and make sure the model is empty
                await Profile.deleteOneByName(profileData.name)
                expect(Profile.name).to.equal('')
                // Make sure the db removed it
                await Profile.findOneByName(profileData.name)
                expect(Profile.name).to.equal('')
            })
            it('Should not remove a model with an invlaid name', async () => {
                const profileData = {
                    name: '',
                    image: 'nope.jpg'
                }
                const Profile = new ProfileModel
                // first check it doesnt exist
                await Profile.findOneByName(profileData.name)
                expect(Profile._id).to.equal('')
                // Create the profile and make sure it worked
                const errors = Profile.create(profileData)
                console.log(errors)
                expect(Profile.name).to.equal('')
                expect(errors.errors.name).to.exist
            })
        })
        describe('`findManyByCount`', function () {
            this.timeout(10000)
            it('Should return the number of profiles specified', async function () {
                const Profile = new ProfileModel
                const count = 5
                const profiles = await Profile.findManyByCount(count)
                expect(profiles.length).to.equal(count)   
            })
            it('Should fail if no count is specified')
        })
        describe('`existsByName`', function () {
            it('Should return true for existing', async () => {
                const profileData = {name: 'TESTPROFILENAME', description: 'Gabble', image: '/publieef/sample.jpg'}
                const Profile = new ProfileModel
                const errors = await Profile.create(profileData)
                const exists = await ProfileModel.existsByName(profileData.name)
                
            })
        })
        describe('`findOneByName`', () => {
            it('Should fill the model on successfil find')
            it('Should return the profile on a correct namr')
            it('Should fail when no profile was found')
        })
        describe('`findManyByName`', () => {
            it('Should return the profiles on a correct name')
            it('Should fail when no profiles were found')
        })
    })
})