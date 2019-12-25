import mongoose from 'mongoose'
var logger = require('../helpers/logger')

/**
 * @class BaseModel
 * 
 * @description Every model should extend this as it provides core methods models should use
 * 
 * @property {string[]} fieldsToExpose    To fill children fields
 * 
 * @method generateObjectId               Generates a mongoose object id from the given param
 * @method stripNonExposableProperties    Strips properties not in the childs fieldsToExpose property
 * @method fill                           Fill the parents properties of a document defined in fieldstoexpose
 * @method empty                          Empty the childs properties defined in fieldstoexpose
 * @method getMongooseDocument            Implementation is required in children, this is called within this class
 * @method update                         Updates the childs model
 */
class BaseModel {

  /**
   * Here to implement the fill method, represents an empty object with no children, or the childs matching property when extended
   * 
   * @var {string[]} fieldsToExpose
   */
  protected fieldsToExpose: string[] = []
  _id: any

  /**
   * Create a mongoose object id from the passed in value
   * 
   * @method generateObjectId
   * 
   * @example
   * const _id = this.generateObjectId(id)
   * if (!_id) console.log('Failed to convert')
   * if (_id) console.log('Converted')
   * 
   * @param {string} id Id of a document to convert
   * 
   * @return {mongoose.Types.ObjectId|boolean} The id, or false if cannot convert
   */
  protected generateObjectId (id: string): mongoose.Types.ObjectId|boolean {
    try {
      // if the id isnt already an object id, convert it
      const objectId = new mongoose.Types.ObjectId(id)
      return objectId
    } catch (err) {
      logger.error(`failed to convert ${id} to a mongoose object id`)
      return false
    }
  } 

  /**
   * Validate output fields
   * 
   * @method stripNonExposableProperties
   * 
   * Before returning a model extracted from the database,
   * strip out any properties that arent defined in the fieldsToExpose
   * array, as suggested. It looks through the object properties and then
   * checks every field to expose against that. Rinse and repeat
   * 
   * @example
   * const document = this.stripNonExposableFields(document, this.fieldsToExpose)
   * 
   * @param {any}       document        The object holding the db data
   * @param {string[]}  fieldsToExpose  this.fieldsToExpose, the childs property
   * 
   * @return {object} The same passed in document but stripping the non-exposable fields
   */
  private stripNonExposableProperties (document: any = {}, fieldsToExpose: string[] = []): object {
    // Loop through the fields to expose
    Object.keys(document).forEach((property: string, value: any) => {
      const allowedToExpose: boolean = fieldsToExpose.includes(property)
      if (!allowedToExpose) {
        delete document[property]
      }
    })
    return document
  }

  /**
  * Fill the model properties with data from the database  
  * 
  * @method fill 
  * 
  * @example
  * // From a child class
  * const Document = Model.find({}).limit(1)
  * this.fill(Document)
  * 
  * @param {object} dbDocument  The document retrieved from a database query. When looping through the keys, it turns out
  *                             the object has hidden properties, hence when we are type hinting so strictly and 
  *                             looking inside the '_doc' property
  * 
  * @return {void}
  */
  protected fill (dbDocument: {$__: any, isNew: any, errors: any, _doc: object, $locals: any}): void {
    const documentData: object = dbDocument._doc
    const strippedDocument: object = this.stripNonExposableProperties(documentData, this.fieldsToExpose)
    // Loops through the document properties
    Object.keys(strippedDocument).forEach((propName: string, propValue: any) => {
      // If the child class has the property
      if (this.hasOwnProperty(propName)) {
        // Assign it 
        // @ts-ignore
        this[propName] = documentData[propName]
      }
    })
  }

  /**
   * Empty the current object by the fieldsToExpose property
   * 
   * @method empty
   * 
   * @example
   * this.empty();
   * 
   * @param {string[]} childFieldsToExpose The string array property of the child class
   * 
   * @return void
   */
  protected empty (): void {
    this.fieldsToExpose.forEach((value: string, index: number) => {
      if (this.hasOwnProperty(value)) {
         // @ts-ignore
        this[value] = null
      }
    })
  }

  /**
   * Used by this specific class to get the calling childs document
   * 
   * @example IMPLEMENTATION
   * class TestModel extends BaseModel {
   *  protected getMongooseDocument (): Document {
   *    return Document
   *  }
   * }
   */
  protected getMongooseDocument (): any {
    throw new Error('Implementation inside child is required')
  }

  /**
   * Update a models properties inside the model itself and the database
   * 
   * @method update
   * 
   * @example
   * const Profile = new ProfileModel(id)
   * const dataToUpdate = {
   *  name: 'new name'
   *  ...
   * }
   * const oldProfile = await Profile.update(data) // fills the model on an update
   * if (oldDocument) {
   *  expect(oldDocument.name).to.not.equal(Profile.name)
   * } else {
   *  logger.error('No document was found with the current id')
   * }
   * 
   * @param {object} data Key value pairs of the property name and new value 
   * @param {Document} Document mongoose document for the calling class
   * 
   * @return {Promise<Document|boolean>} The old document (before updating) or false based on the success
   */
  public async update (data: { [key: string]: any[] }): Promise<Document|boolean> {
    let dataToUpdate: { [key: string]: any } = {} // to store fields to update
    // Loop through the key values pairs provided
    Object.keys(data).forEach((propName: string, propVal: any) => {
      // Check the props passed in are in this class
      if (this.hasOwnProperty(propName)) {
        // Check if that prop passed in is different than
        // the existing prop
        if (this[propName] !== data[propName]) {
          // Push the data to update!
          //this[propName] = data[propName]
          dataToUpdate[propName] = data[propName]
        }
      }
    })
    try {
      const query = { _id: this._id }
      const options = { upsert: true }
      const Model = this.getMongooseDocument()
      const oldDocument = await Model.findOneAndUpdate(query, dataToUpdate, options)
      if (Array.isArray(oldDocument) && !oldDocument.length || !oldDocument) {
        return false
      }
      const updatedDocument = await Model.findById(this._id)
      this.fill(updatedDocument)
      return oldDocument
    } catch (err) {
      logger.error(err.message)
      return false
    }
  }

}

module.exports = BaseModel