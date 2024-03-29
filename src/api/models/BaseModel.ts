import mongoose, { Document, Model } from "mongoose";

import IIndexSignature from "../interfaces/models/IndexSignatureInterface";
import logger from "../helpers/logger";

interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
    };
  };
}

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
 * @property {string}     tablename       Name of the mongoose table for the model
 *
 * @method generateObjectId               Generates a mongoose object id from the given param
 * @method stripNonExposableProperties    Strips properties not in the childs fieldsToExpose property
 * @method fill                           Fill the parents properties of a document defined in fieldstoexpose
 * @method empty                          Empty the childs properties defined in fieldstoexpose
 * @abstract @method getMongooseModel     Implementation is required in children, this is called within this class
 * @method update                         Updates the childs model
 * @method create                         Create an entry in the database
 * @method find                           Used for any SELECT queries
 * @method delete                         Used for any DELETE queries
 */
export default abstract class BaseModel implements IIndexSignature {
  [key: string]: string | boolean | number | unknown;

  /**
   * When the entry was created
   *
   * @var {string|null} created_at
   */
  protected abstract created_at: string | null;

  /**
   * When the entry was updated
   *
   * @var {string|null} updated_at
   */
  protected abstract updated_at: string | null;

  /**
   * Here to implement the fill method, represents an empty object with no children, or the childs matching property when extended
   *
   * @var {string[]} fieldsToExpose
   */
  protected abstract fieldsToExpose: string[];

  /**
   * The name of the table associated with this model
   *
   * @var {string} tablename
   */
  protected abstract tablename: string;

  /**
   * Get the mongoose model of this model
   *
   * This is here so in the BaseModel, it can call 'this' method to get the document
   *
   * @return {Document} The mongoose model from the schema
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract getMongooseModel(): Model<any>;

  private stripNonExposableFields(document: Document): void {
    Object.keys(document.toObject()).forEach((property: string) => {
      const allowedToExpose = this.fieldsToExpose.includes(property);
      if (allowedToExpose === false) {
        document.set(property, null); // only if we dont use doc.toObject()
      }
    });
  }

  /**
   * Fill the model properties with data from the database
   *
   * @method fill
   *
   * @example
   * const Document = Model.find({}).limit(1)
   * this.fill(Document)
   *
   * @param {object} document  The document retrieved from a database query. When looping through the keys, it turns out
   *                             the object has hidden properties, hence when we are type hinting so strictly and
   *                             looking inside the '_doc' property
   *
   * @return {void}
   */
  private fill(document: Document): void {
    this.empty();
    // Loops through the document properties
    Object.keys(document.toObject()).forEach((propName: string) => {
      // If the child class has the property
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(propName)) {
        // Assign it
        // eslint-disable-next-line no-prototype-builtins
        this[propName] = document.get(propName);
      }
    });
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
  private empty(): void {
    this.fieldsToExpose.forEach((value: string) => {
      // eslint-disable-next-line no-prototype-builtins
      //if (this.hasOwnProperty(value)) {
      this[value] = null;
      //}
    });
  }

  /**
   * Update a models properties inside the model itself and the database
   *
   * @method update
   *
   * @requires _id A populated model with _id defined
   *
   * @example
   * const Profile = new ProfileModel(id)
   * const query = {name: 'current name'}
   * const dataToUpdate = {
   *  name: 'new name'
   *  ...
   * }
   * const oldDocument = await Profile.update(data) // fills the model on an update
   * if (oldDocument) {
   *  expect(oldDocument.name).to.not.equal(Profile.name)
   * } else {
   *  logger.error('No document was found with the current id')
   * }
   *
   * @param {object} query The query to find the document to update e.g. where name = edward: {name: 'edward'}
   * @param {object} data Key value pairs of the property name and new value
   * @param {Document} Document mongoose document for the calling class
   *
   * @return {Promise<Document|boolean>} The old document (before updating) or false based on the success
   */
  public async update<T>(
    query: { [key: string]: unknown },
    data: { [key: string]: unknown }
  ): Promise<T | boolean> {
    const options = { upsert: true };
    const MongooseModel = this.getMongooseModel();
    const oldDocument = await MongooseModel.findOneAndUpdate(
      query,
      data,
      options
    );
    if (oldDocument === null) {
      // Document doesn't exist
      return false;
    }
    const updatedDocument = await MongooseModel.findOne(data);
    this.stripNonExposableFields(updatedDocument);
    this.fill(updatedDocument);
    return oldDocument;
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
   * const errs = await Profile.create(data) // fills the model
   *
   * @param data Key value pairs e.g. {name: '', image: ''}
   *
   * @return {void|object} Return value is set if validation errors are returned
   */
  public async create<T>(data: T): Promise<void | ValidationError> {
    const MongooseModel = this.getMongooseModel();
    const document = new MongooseModel(data);
    try {
      await document.save();
      this.stripNonExposableFields(document);
      this.fill(document);
      logger.info("[BaseModel - create: filled the model]");
    } catch (validationError) {
      if (validationError instanceof mongoose.Error.ValidationError) {
        const fieldName: string = Object.keys(validationError.errors)[0];
        const errorMessage: string = validationError.errors[fieldName].message;
        logger.error(`Validation error: ${errorMessage}`);
        return validationError;
      }
    }
  }

  /**
   * @method find
   *
   * @description The entry point method for finding db results.
   *              Fills the calling model when finding or found a single document
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
   * @param {object} query Key value pair of data to use in the query, e.g find a name by 'edward': query = {name: 'edward'}. Defaults to {} (find all) if not passed in
   * @param {number} limiter Number to limit results by, defaults to 1 if not passed in
   * @param {object} sortable Key value pair(s) to sort data e.g. const sorter = {date: -1}. Defaults to empty (don't sort) if not passed in
   *
   * @returns {[object]|boolean} False if an error, array if the db query returned data
   */
  public async find<T>(
    query?: { [key: string]: unknown },
    limiter = 1,
    sortable = {}
  ): Promise<false | T[]> {
    // If query is empty, set it to an empty object
    if (!query) {
      query = {};
    }
    const MongooseModel = this.getMongooseModel();
    // Find using the query is there is one, limit the results if present, and sort if present as well
    const result = await MongooseModel.find(query)
      .limit(limiter)
      .sort(sortable);

    // check for an empty response
    if ((Array.isArray(result) && !result.length) || !result) {
      // empty
      return false;
    }

    // If it's a single object then fill (check strongly as we are supposed to be returning a document)
    // and if limit isnt defined or equals 1
    // if (result && !result.length && !Array.isArray(result) && typeof result === 'object') {
    result.forEach((doc) => {
      this.stripNonExposableFields(doc);
    });
    if (result && result.length === 1) {
      this.fill(result[0]);
    }
    return result;
  }

  /**
   * @method delete
   *
   * @description Handles DELETE queries to the database. Converts a passed in _id also.
   *
   * @example
   * class TestModel extends BaseModel {
   *  ...
   * }
   * const query = {}|null|undefined|{name: ...}
   * const deleteMany = true|false
   * const Test = new TestModel
   * const success = await Test.delete(query, deleteMany) // returns false mis query is empty and deletemany is true to stop a purge
   * if (success) {
   *  // do what you need to do
   * }
   *
   * @param {object} query Key value pair of data to use in the query, e.g delete on by name = 'edward': query = {name: 'edward'}. Defaults to {} if not passed in
   * @param {boolean} deleteMany Do you want to delete many? Defaults to false to deleteOne
   *
   * @returns {boolean} Success of the method call
   */
  public async delete(
    query: { [key: string]: unknown },
    deleteMany = false
  ): Promise<boolean> {
    const MongooseModel = this.getMongooseModel();
    // delete a single doucment
    if (!deleteMany) {
      const result = await MongooseModel.deleteOne(query);
      if (result.deletedCount === 1) {
        this.empty();
        return true;
      }
      return false;
    }
    // delete many documents
    // and if the query is empty and wipe isnt allowed, don't let them delete EVERYTHING
    if (Object.keys(query).length === 0) {
      return false;
    }
    const result = await MongooseModel.deleteMany(query);
    if (result.deletedCount >= 1) {
      this.empty();
      return true;
    }
    return false;
  }
}
