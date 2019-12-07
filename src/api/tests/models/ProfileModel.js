const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

describe('Profile Model', () => {
    describe('Properties', () => {
        it ('Should have the specific properties')
        it('Should have the specific properties to expose')
        it('Should fill the specified properties')
        it('Tablename should be defined correctly')
    })
    describe('Methods', () => {
        describe('`create`', () => {
            it('Should return a document with valid params')
            it('Should fail when a name isnt passed in')
            it('Should pass when description isnt passed in')
            it('Should fail when no image is passed in')
        })
        describe('`insertOne`', () => {
            it('Should insert a row on valid data')
            it('Should return true on success')
            it('Should return false on failure')
            it('Should fill the Model with the data on success')
        })
        describe('`findOneById`', () => {
            it('Should return a profile on valid id')
            it('Should return an empty array in invalid data')
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