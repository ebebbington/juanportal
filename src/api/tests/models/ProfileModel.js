const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const rewire = require('rewire')
const ProfileModel = rewire('../../models/ProfileModel')

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
    describe('Methods', () => {
        describe('`create`', function () {
            const profileData = {
                name: 'Edward',
                description: 'Hello',
                image: 'sample.jpg'
            }
            it('Should create a profile with valid params', async () => {
                const Profile = new ProfileModel
                const errors = await Profile.create(profileData)
                console.log('showig errors')
                console.log(errors)
                console.log('showing profile')
                console.log(Profile)
                expect(Profile.name).to.equal(profileData.name)
            })
            it('Should fail when a name isnt passed in', async () => {
                const Profile = new ProfileModel
                const data = {
                    description: 'Hello',
                    image: 'sample.jpg'
                }
                const errors = await Profile.create(data)
                console.log(errors)
                expect(errors.errors).to.haveOwnProperty('name')  
            })
            it('Should pass when description isnt passed in', async () => {
                const Profile = new ProfileModel
                const data = {
                    name: 'Edward',
                    image: 'sample.jpg'
                }
                const errors = await Profile.create(data)
                expect(errors).to.not.exist
                expect(Profile.name).to.equal(data.name)
                expect(Profile.description).to.equal(data.description)
                expect(Profile.image).to.equal(data.image)
            })
            it('Should fail when no image is passed in', async () => {
                const Profile = new ProfileModel
                const data = {
                    name: 'Edward',
                    description: 'Hello'
                }
                const errors = await Profile.create(data)
                expect(errors.errors).to.haveOwnProperty('image')  
            })
            afterEach(() => {
                const Profile = new ProfileModel
                Profile.deleteOneByName(profileData.name)
            })
        })
        describe('`findOneById`', function () {
            const profileData = {
                name: 'Edward',
                description: 'Hello',
                image: 'sample.jpg'
            }
            before(() => {
                const Profile = new ProfileModel
                const errors = Profile.create(profileData)
                console.log(errors)
            })
            // not sure why this takes so long
            it.skip('Should return a profile on valid id', async (done) => {
                const Profile = new ProfileModel
                const result = await Profile.findOneByName(profileData.name)
                await Profile.findOneById(Profile._id)
                expect(Profile2.name).to.equal(profileData.name)
                expect(Profile2.description).to.equal(profileData.description)
                expect(Profile2.image).to.equal(profileData.image)
                done()
            })
            it('Should return an empty array in invalid data', async () => {
                const Profile = new ProfileModel
                await Profile.findOneById('jhjhjhjhjkjjk')
                expect(Profile._id).to.equal('')
                expect(Profile.name).to.equal('')
                expect(Profile.description).to.equal('')
                expect(Profile.image).to.equal('')
            })
            //not sure why this takes so long
            // afterEach( async () => {
            //     const Profile = new ProfileModel
            //     await Profile.deleteManyByName(profileData.name)
            // })
        })
        describe('`deleteOneById`', () => {
            it('Should delete a profile on valid id', async () => {
                const Profile = new ProfileModel
                await Profile.create({
                    name: 'edward',
                    image: 'sample.jpg'
                })
                await Profile.findOneById(Profile._id)
                expect(Profile._id).to.exist
                await Profile.findOneById(Profile._id)
                expect(Profile._id).to.exist
            })
            it('Should fail on an invalid id', async () => {
                const Profile = new ProfileModel
                const success = Profile.findOneById('45854895498')
                expect(success).to.equal(false)
                expect(Profile._id).to.equal('')
            })
        })
        describe('`findManyByCount`', () => {
            it('Should return the number of profiles specified')
            it('Should fail if no count is specified')
        })
        describe('`deleteOneByName`', () => {
            
        })
        describe('`existsByName`', () => {

        })
        describe('`findOneByName`', () => {

        })
        describe('`findManyByName`', () => {

        })
    })
})