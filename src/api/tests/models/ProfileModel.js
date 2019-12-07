const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const rewire = require('rewire')
const ProfileModel = rewire('../../models/ProfileModel')

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
        describe('`create`', () => {
            const profileData = {
                name: 'Edward',
                description: 'Hello',
                image: 'sample.jpg'
            }
            it('Should create a profile with valid params', () => {
                const Profile = new ProfileModel
                const errors = Profile.create(profileData)
                expect(errors).to.not.exist
                expect(Profile.name).to.equal(profileData.name)
                expect(Profile.description).to.equal(profileData.description)
                expect(Profile.image).to.equal(profileData.image)
            })
            it('Should fail when a name isnt passed in', () => {
                const Profile = new ProfileModel
                const data = {
                    description: 'Hello',
                    image: 'sample.jpg'
                }
                const errors = Profile.create(data)
                expect(errors.errors).to.haveOwnProperty('name')  
            })
            it('Should pass when description isnt passed in', () => {
                const Profile = new ProfileModel
                const data = {
                    name: 'Edward',
                    image: 'sample.jpg'
                }
                const errors = Profile.create(data)
                expect(errors).to.not.exist
                expect(Profile.name).to.equal(data.name)
                expect(Profile.description).to.equal(data.description)
                expect(Profile.image).to.equal(data.image)
            })
            it('Should fail when no image is passed in', () => {
                const Profile = new ProfileModel
                const data = {
                    name: 'Edward',
                    description: 'Hello'
                }
                const errors = Profile.create(data)
                expect(errors.errors).to.haveOwnProperty('image')  
            })
            afterEach(() => {
                const Profile = new ProfileModel
                Profile.deleteManyByName(profileData.name)
            })
        })
        describe('`findOneById`', () => {
            const profileData = {
                name: 'Edward',
                description: 'Hello',
                image: 'sample.jpg'
            }
            before(() => {
                const Profile = new ProfileModel
                Profile.create(profileData)
            })
            it('Should return a profile on valid id', () => {
                const Profile = new ProfileModel
                Profile.findOneByName(profileData.name)
                const Profile2 = new ProfileModel
                Profile2.findOneById(Profile._id)
                expect(Profile2.name).to.equal(profileData.name)
                expect(Profile2.description).to.equal(profileData.description)
                expect(Profile2.image).to.equal(profileData.image)
            })
            it('Should return an empty array in invalid data')
            after(() => {
                const Profile = new ProfileModel
                Profile.deleteOneByName(profileData.name)
            })
        })
        describe('`deleteOneById`', () => {

        })
        describe('`deleteManyById`', () => {

        })
        describe('`deleteManyByName`', () => {
           
        
        })
        describe('`findManyByCount`', () => {

        })
        describe('`existsByName`', () => {

        })
        describe('`findOneByName`', () => {

        })
        describe('`findManyByName`', () => {

        })
    })
})