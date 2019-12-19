//throw new Error('Think about how to implement the saving and deleting before developing this')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

const rewire = require('rewire')
const fs = require('fs')

const logger = require('../../helpers/logger')
logger.debug = function () {}
logger.info = function () {}

chai.use(chaiAsPromised)
chai.should()

describe('ImageHelper', () => {

    describe('Methods', () => {

        const ImageHelper = rewire('../../helpers/ImageHelper')
        const Image = new ImageHelper

        describe('createNewFileName', () => {

            it('Should return a correct name on valid file name', () => {
                const exampleFileName = 'sampleimage.jpg'
                const result = Image.createNewFilename(exampleFileName)
                const fileName = result.split('.')[0]
                const extension = result.split('.')[1]
                expect(fileName.length).to.equal(36)
                expect(fileName).to.not.equal(exampleFileName)
                expect(extension).to.equal(exampleFileName.split('.')[1])
            })

            it('Should return false on an invalid parameter', () => {
                const result = Image.createNewFilename('someimage')
                expect(result).to.equal(false)
            })

        })

        describe('getExtension', () => {

            it('Should return .jpg on no param', () => {
                const extension = Image.getExtension()
                expect(extension).to.equal('.jpg')
            })

            it('Should return .jpg if an extension couldnt be found', () => {
                const extension = Image.getExtension('someimage')
                expect(extension).to.equal(false)
            })

            it('Should return the extension of the passed in param if valid', () => {
                const extension = Image.getExtension('someimage.PNG')
                expect(extension).to.equal('.PNG')
            })

        })

        describe('saveToFS', () => {

            it('Should return false when no filename is passed in', () => {
                const result = Image.saveToFS()
                expect(result).to.equal(false)
            })

            it('Should save a file', () => {
                const image = fs.readFileSync('/var/www/api/sample.jpg')
                const saved = Image.saveToFS('testname.jpg', image)
                expect(saved).to.equal(true)
            })

            it('Should save a file even when no file is passed in', () => {
                const image = fs.readFileSync('/var/www/api/sample.jpg')
                const saved = Image.saveToFS('testname.jpg')
                expect(saved).to.equal(true)
            })

        })

        describe('existsOnFS', () => {

            it('Should return true if the file exists')

            it('Should return false if the file doesnt exist')

        })

        describe('generateRandomName', () => {

            it('Should return a 36 character random string')

        })

        describe('deleteFromFS', () => {

            it('Should return false for not existing anymore')

        })

    })

})
