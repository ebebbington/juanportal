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