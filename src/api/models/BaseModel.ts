const mongoose = require('mongoose')
const loggerr = require('../helpers/logger')

/**
 * @class BaseModel
 * 
 * @description Every model should extend this as it provides core methods models should use
 * 
 * @property {string[]} fieldsToExpose To fill children fields
 * 
 * @method validateInputFields Validate a model
 * @method validateOutputFields Strips unrequired fields from a database document
 * @method fill Fill the parents properties of a document defined in fieldstoexpose
 * @method empty Empty the childs properties defined in fieldstoexpose
 */
class BaseModel {

  /**
   * Here to implement the fill method, represents an empty object with no children, or the childs matching property when extended
   * 
   * @var {string[]} fieldsToExpose
   */
  protected fieldsToExpose: string[] = []

  protected generateObjectId (id: string) {
    try {
      // if the id isnt already an object id, convert it
      id = new mongoose.Types.ObjectId(id)
      return id
    } catch (err) {
      loggerr.error(`failed to convert ${id} to a mongoose object id`)
      return false
    }
  } 

  /**
   * Validate output fields
   * 
   * Before returning a model extracted from the database,
   * strip out any properties that arent defined in the fieldsToExpose
   * array, as suggested. It looks through the object properties and then
   * checks every field to expose against that. Rinse and repeat
   * 
   * @param {object} model The model object retrieved from the database 
   * 
   * @return {object} The same passed in model but stripping the non-exposable fields
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
  * @example const Profile = new ProfileModel; const newProfile = Profile.create(...); Profile.insertOne(newProfile);
  * 
  * @example From a child function: this.fill(object)
  * 
  * @param {object} dbDocument The document retrieved from a database query. When looping through the keys, it turns out
  *                             the object has hidden properties, hence when we are type hinting so strictly and 
  *                             looking inside the '_doc' property
  * 
  * @return void
  */
  protected fill (dbDocument: {$__: any, isNew: any, errors: any, _doc: object, $locals: any}): void {
    const documentData: object = dbDocument._doc
    const strippedDocument: object = this.stripNonExposableProperties(documentData, this.fieldsToExpose)
    // Loops through the document properties
    Object.keys(strippedDocument).forEach((propName, propValue) => {
      // If the child class has the property
      if (this.hasOwnProperty(propName)) {
        // Assign it 
        // @ts-ignore: Unreachable code error /* TS doesnt like "this[propName]" but it works so ignore it */
        this[propName] = documentData[propName]
      }
    })

    // Method 1 - this should be used when the fieldstoexpose prop is a string[]
    // this.fieldsToExpose.forEach((field) => {
    //   // first check this class has the fillable property
    //   if (this.hasOwnProperty(field)) {
    //     // Then assign the fillable property with the matching property in the parameter
    //     this[field] = object[field]
    //   }
    // })
  }

  /**
   * Empty the current object of profile fields
   * 
   * @method empty
   * 
   * @example From a child function: this.empty(this.fieldsToExpose);
   * 
   * @param {string[]} childFieldsToExpose The string array property of the child class
   * 
   * @return void
   */
  protected empty (): void {
    this.fieldsToExpose.forEach((value: string, index: number) => {
      if (this.hasOwnProperty(value)) {
         // @ts-ignore: Unreachable code error
        this[value] = null
      }
    })
  }
}

module.exports = BaseModel