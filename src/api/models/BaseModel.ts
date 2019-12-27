import mongoose from 'mongoose'
var logger = require('../helpers/logger')

/**
 * @class BaseModel
 * 
 * @description Every model should extend this as it provides core methods models should use
 * 
 * @example
 * import BaseModel from 'BaseModel'
 * class Model extends BaseModel { ... }
 * 
 * @property {string|null} created_at     Database field
 * @property {string|null} updated_at     Database field
 * @property {string[]} fieldsToExpose    To fill children fields
 * 
 * @method generateObjectId               Generates a mongoose object id from the given param
 * @method stripNonExposableProperties    Strips properties not in the childs fieldsToExpose property
 * @method fill                           Fill the parents properties of a document defined in fieldstoexpose
 * @method empty                          Empty the childs properties defined in fieldstoexpose
 * @abstract @method getMongooseDocument  Implementation is required in children, this is called within this class
 * @method update                         Updates the childs model
 * @method create                         Create an entry in the database
 */
export default abstract class BaseModel {

  /**
   * When the entry was created
   * 
   * @var {string|null} created_at
   */
  protected abstract created_at: string|null

  /**
   * When the entry was updated
   * 
   * @var {string|null} updated_at
   */
  protected abstract updated_at: string|null

  /**
   * Here to implement the fill method, represents an empty object with no children, or the childs matching property when extended
   * 
   * @var {string[]} fieldsToExpose
   */
  protected abstract fieldsToExpose: string[]

   /**
   * The name of the table associated with this model
   * 
   * @var {string} tablename
   */
  protected abstract tablename: string

  _id: any

  /**
   * Get the mongoose document of this model
   * 
   * This is here so in the BaseModel, it can call 'this' method to get the document
   *
   * @return {Document} The mongoose document from the schema
   */
  protected abstract getMongooseDocument (): Document

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
        //@ts-ignore
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

  /**
   * Insert a document into the database
   * 
   * @requires getMongooseDocument Children must add this method and return their Document
   * 
   * Used to create a model from data to then be saved into the database
   * 
   * @method create
   * 
   * @example
   * const Profile = new ProfileModel;
   * const data = {name: 'hello', ....}
   * const newProfile = await Profile.create(data)
   * 
   * @param {{ [key: string]: any[] }} data Key value pairs e.g. {name: '', image: ''}
   * 
   * @return {void|object} Return value is set if validation errors are returned
   */
  public async create (data: { [key: string]: any[] }): Promise<any> {
    const Document = this.getMongooseDocument()
    //@ts-ignore
    const document = new Document(data)
    try {
      await document.save()
      this.empty()
      this.fill(document)
      logger.info(`[BaseModel - create: filled the model]`)
    } catch (validationError) {
      const fieldName: string = Object.keys(validationError.errors)[0]
      const errorMessage: string = validationError.errors[fieldName].message
      logger.error(`Validation error: ${errorMessage}`)
      return validationError
    }
  }

  /**
   * @method find
   * 
   * @description The entry point method for finding db results
   * 
   * @example
   * class MyOtherClass extends BaseModel {
   *  ...
   * }
   * const query?
   *    = {}|null|undefined // defaults to empty object to find all
   *    = {name: 'edward'} // uses this data in the query to find by
   *    = {_id: req.params.id} // auto converts _id to a mongoose object id
   * const limiter? = 100 // number of results to limit, defaults to 1
   * const sortables? = {date: -1} // -1 & desc & descending = desc, 1 & asc, ascending = asc
   * const result = MyOtherClass.find(query?, limiter?, sortables?)
   * if (result) {
   *  // do what you need
   * }
   * 
   * @todo REMEMBER, this won't return all arrays
   * 
   * @param {object} query Key value pair of data to use in the query, e.g find a name by 'edward': query = {name: 'edward'}. Defaults to {} (find all) if not passed in
   * @param {number} limiter Number to limit results by, defaults to 1 if not passed in
   * @param {object} sortable Key value pair(s) to sort data e.g. const sorter = {date: -1}. Defaults to empty (don't sort) if not passed in 
   * 
   * @returns {[object]|boolean} False if an error, array if the db query returned more than 1 result, true if single object (and fills)
   */
  public async find (query: { [key: string]: any } = {}, limiter: number = 1, sortable: object = {}): Promise<boolean|Array<object>> {
    // Convert the _id to an object id if passed in
    if (query && query._id) {
      query._id = this.generateObjectId(query._id)
      if (!query._id) {
        return false
      }
    }
    const Document = this.getMongooseDocument()
    // Find using the query is there is one, limit the results if present, and sort if present as well
    const result = await Document.find(query).limit(limiter).sort(sortable)
    // check for an empty response
    if (Array.isArray(result) && !result.length || !result) {
      // empty
      return false
    }
    // If it's a single object then fill (check strongly as we are supposed to be returning a document)
    if (result && !result.length && !Array.isArray(result) && typeof result === 'object') {
      this.fill(result)
      return true
    }
    // If it's an array of documents return them as we can't fill
    if (result.length && Array.isArray(result)) {
      return result
    }
    // should never reach here
    logger.error('[BaseModel - find: Unreachable code is reachable. Data to check is:' + result)
    return false
  }

}