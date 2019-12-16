const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

const _ = require('lodash')

const rewire = require('rewire')
const BaseModel = require('../../models/BaseModel')

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

// const Test = new TestModel({
//     forename: 'Edward',
//     surname: 'Bebbington',
//     age: 21,
//     postcode: 'NG31 8FY'
// })
// console.log(Test)

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
            it('Should be an empty object', () => {
                const empty = _.isEmpty(T.fieldsToExpose)
                const type = typeof T.fieldsToExpose
                expect(empty).to.equal(true)
                expect(type).to.equal('object')
            })
        })

    })
    describe('Methods', () => {
        describe('validateInputFields', () => {
            it('Should return errors when failed to validate against the model')
            it('Should return null when succesfully validated the model')
        })
        describe('getObjectId', () => {
            const Base = new BaseModel
            const Schema = mongoose.Schema
            const ObjectIdType = Schema.ObjectId
            const stringId = '4edd40c86762e0fb12000003'
            it('Should return a mongoose object id on a successful parse', () => {
                const objectId = Base.getObjectId(stringId)
                const isValidObjectId = mongoose.Types.ObjectId.isValid(objectId)
                expect(isValidObjectId).to.equal(true)
            })
            it('Should return the passed in id when already a mongoose id', () => {
                const objectId = mongoose.Types.ObjectId()
                const objectId2 = Base.getObjectId(objectId)
                expect(objectId).to.equal(objectId2)
            })
            it('Should return false when failed to convert', () => {
                const invalidStringId = '5'
                const objectId = Base.getObjectId(invalidStringId)
                console.log(objectId)
                expect(objectId).to.equal(false)
            })
            it('Should be a protected method', () => {
                const Test = new TestModel({forename: null, surname: null, age: null, postcode: null})
                const objectId = Test.getObjectId(stringId)
                const isValidObjectId = mongoose.Types.ObjectId.isValid(objectId)
                expect(isValidObjectId).to.equal(true)
            })
        })
        describe('validateOutputFields', () => {
            it('Should remove properties from a model that arent in `fieldsToExpose`')
            it('Should return the passed in model when no properties exist')
        })
        describe.only('fill', () => {
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
                console.log(Test)
            })
        })
    })
})