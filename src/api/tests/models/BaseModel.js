require('babel-register')({
    ignore: false
})

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

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

class TestModel extends BaseModel {
    constructor (props) {
        super(props)

        this.forename = props.forename || null

        this.surname = props.surname || null

        this.fullname = this.forename && this.surname ? this.forename + ' ' + this.surname : null

        this.age = props.age || null

        this.postcode = props.postcode || null

        this.fieldsToExpose = [
            'forename',
            'surname',
            'age'
        ]
    }
}

describe('BaseModel', () => {

    describe('Properties', () => {

        describe('fieldsToExpose', () => {

            // Check children can access it
            class Test extends BaseModel {
                constructor() {
                    super()
                }
            }
            const T = new Test

            it('Should be protected', () => {
                expect(T).to.haveOwnProperty('fieldsToExpose')
            })

            it('Should be an empty array', () => {
                expect(T.fieldsToExpose.length).to.equal(0)
                expect(Array.isArray(T.fieldsToExpose)).to.equal(true)
            })

        })

    })

    describe('Methods', () => {

        describe('getMongooseDocument', () => {

            it('Should exist')

            it('Should not be implemented yet')

        })

        describe('update', () => {

            it('Should return false if no document was found with the models id')

            it('Should return the old document after updating')

            it('Should fill the calling model on success')

            it('Should fail when an error is thrown in the catch')

        })

        describe('`create`', function () {

            it('Should fill the model on a successful creation')

            it('Should fail when validation isnt met')

            afterEach('Delete test entry')

        })

        describe('generateObjectId', () => {

            const Base = new BaseModel
            const Schema = mongoose.Schema
            const ObjectIdType = Schema.ObjectId
            const stringId = '4edd40c86762e0fb12000003'

            it('Should return a mongoose object id on a successful parse', () => {
                const objectId = Base.generateObjectId(stringId)
                const isValidObjectId = mongoose.Types.ObjectId.isValid(objectId)
                expect(isValidObjectId).to.equal(true)
            })

            it('Should return the passed in id when already a mongoose id', () => {
                const objectId = mongoose.Types.ObjectId()
                const objectId2 = Base.generateObjectId(objectId)
                expect(objectId).to.equal(objectId2)
            })

            it('Should return false when failed to convert', () => {
                const invalidStringId = '5'
                const objectId = Base.generateObjectId(invalidStringId)
                expect(objectId).to.equal(false)
            })

            it('Should be a protected method', () => {
                const Test = new TestModel({forename: null, surname: null, age: null, postcode: null})
                const objectId = Test.generateObjectId(stringId)
                const isValidObjectId = mongoose.Types.ObjectId.isValid(objectId)
                expect(isValidObjectId).to.equal(true)
            })

        })

        describe('stripNonExposableFields', () => {

            it('Should remove properties from a model that arent in `fieldsToExpose`', () => {
                const rewire = require('rewire')
                const RewiredBaseModel = rewire('../../models/BaseModel')
                const Base = new RewiredBaseModel
                const exampleDoc = {
                    _id: 'mongoose object id',
                    forename: 'Edward',
                    surname: 'Bebbington',
                    age: 21,
                    postcode: 'NG31 8FY'
                }
                const exampleFieldsToExpose = [
                    'forename',
                    'surname',
                    'age'
                ]
                const stripped = Base.stripNonExposableProperties(exampleDoc, exampleFieldsToExpose)
                expect (stripped._id).to.not.exist
                expect(stripped.forename).to.equal(exampleDoc.forename)
                expect(stripped.surname).to.equal(exampleDoc.surname)
                expect(stripped.age).to.equal(exampleDoc.age)
                expect(stripped.postcode).to.not.exist
            })

        })

        describe('fill', () => {

            it('Should set the matching properties in fieldsToExpose of the passed in document', () => {
                const Test = new TestModel({forename: null, surname: null, age: null, postcode: null})
                // Mimick a DB document
                const doc = {
                    $__: false,
                    isNew: false,
                    errors: false,
                    _doc: {
                        forename: 'TESTFORENAME',
                        surname: 'TESTSURNAME',
                        age: 100,
                        postcode: 'TESTPOSTCODE'
                    },
                    $locals: false
                } 
                Test.fill(doc)  
            })

        })

        describe('empty', () => {

            it('Should empty the models properties by their fieldsToExpose', () => {
                const Test = new TestModel({forename: null, surname: null, age: null, postcode: null})
                const doc = {
                    $__: false,
                    isNew: false,
                    errors: false,
                    _doc: {
                        forename: 'TESTFORENAME',
                        surname: 'TESTSURNAME',
                        age: 100,
                        postcode: 'TESTPOSTCODE'
                    },
                    $locals: false
                } 
                Test.fill(doc)
                expect(Test.surname).to.equal(doc._doc.surname)
                expect(Test.forename).to.equal(doc._doc.forename)
                expect(Test.age).to.equal(doc._doc.age)
                Test.empty()
                expect(Test.surname).to.equal(null)
                expect(Test.forename).to.equal(null)
                expect(Test.age).to.equal(null)
            })

        })

    })
    
})