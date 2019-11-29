import {types} from "util";
import isModuleNamespaceObject = module
import validate = WebAssembly.validate;
import { Schema } from "inspector";
import { FILE } from "dns";

const mongoose = require('mongoose')
const logger = require('../helpers/logger')
const util = require('util')
const BaseModel = require('/var/www/juanportal/models/BaseModel')
const BaseModelInterface = require('../interfaces/models/BaseModelInterface')

//
// Profile Schema - Define the data we want access to
//

interface testa {
  name?: string,
  description: string,
  image: string,
  test: Function
}

/**
 * Profile Schema
 * 
 * Defines the baseline for the Profile model
 */
const Schema = new mongoose.Schema({
  'name': {
    type: String,
    required: [true, 'Name has not been supplied'],
    minlength: [2, 'Name is too short and should be at least 2 characters in length'],
    maxlength: [140, 'Name is too long and should not exceed 140 characters'],
    validate: {
      validator: function (v: string) {
        return /.+[^\s]/.test(v)
      },
      message: (props: { value: any; }) => `${props.value} is not set`
    }
  },
  'description': {
    type: String,
    required: false,
    maxlength: [400, 'Description is too long and should not exceed 400 characters']
  },
  'image': {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function (v: string) {
        return /\.(jpg|jpeg|JPG|JPEG|png|PNG)$/.test(v)
      },
      message: (props: { value: any; }) => `${props.value} is not a valid image extension`
    },
    minlength: [5, 'Image name is to small, therefore not a valid name'] //eg z.png
  }
}, {timestamps: true})

/**
 * Profile Document
 * 
 * Creates a model instance of the table schema
 */
const Document = mongoose.model('Profile', Schema)

/**
 * @class ProfileModel
 * 
 * @author Edward Bebbington
 * 
 * @extends BaseModel
 *
 * @property _id
 * @property name
 * @property description
 * @property image
 *
 * 
 * @method
 * 
 * @example
 *    // When wanting to save a new user
 *    const newProfile = new ProfileModel({name, descr, image})
 *    // When getting a user
 *    const ProfileModel = new ProfileModel;
 *    const profile = ProfileMode.find...
 */
class ProfileModel extends BaseModel {

  public _id: number = 0

  /**
   * Name field of the profile model
   * 
   * @var {string} name
   */
  public name: string = ''

  /**
   * Description field of the profile model
   * 
   * @var {string} description
   */
  public description: string = ''

  /**
   * Image field of the profile model
   * 
   * @var {string} image
   */
  public image: string = ''

  /**
   * The name of the table associated with this model
   * 
   * @var {string} tablename
   */
  private readonly tablename: string = 'Profile'

  /**
   * Fields in the database to be assigned to this model
   * 
   * Sometimes we dont want to retrieve sensitive data,
   * this allows us to map database columns to the model
   * 
   * @var {string[]} fieldsToExpose
   */
  private readonly fieldsToExpose: string[] = [
      '_id',
      'name',
      'description',
      'image'
  ]

  /**
   * The list of database table columns to be assigned to this model
   * 
   * @var {string[]} fillables
   */
  // private fillables: string[] = [
  //   'name',
  //   'description',
  //   'image'
  // ]
                                                                                                                                                                                                                                                             


  /**
   * Constructor
   * 
   * Can be called without the parameter. If a parameter
   * is defined, the constructor will find a profile by that id
   * and return the profile
   * 
   * @example
   *    // Wanting to create a user
   *    const Profile = new ProfileModel
   *    Profile.create({params})
   *    // When getting a user
   *    const Profile = new Profile(id)
   * 
   * @param id The id of the user to find, regardless of it being a mongoose object id or not
   */
  constructor (id?: number) {
    super(id)
    if (id) {
      logger.debug('an id was passed in to the profile model constructor')
      this.findOneById(id)
    }
   }

  /**
  * Fill the model properties with data from the database  
  * 
  * @method fill 
  * 
  * @param {*} object The object containing the data receieved or sent to the db
  * 
  * @return void
  */
  private fill (object: any): void {
    // Loops through array of table columns this model should have
    this.fieldsToExpose.forEach((field) => {
      // first check this class has the fillable property
      if (this.hasOwnProperty(field)) {
        // Then assign the fillable property with the matching property in the parameter
        this[field] = object[field]
      }
    })
  }

  /**
   * 
   */
  private empty () {
    this.fieldsToExpose.forEach((field) => {
      if (this.hasOwnProperty(field)) {
        switch (typeof this[field]) {
          case 'string':
            this[field] = ''
          case 'number':
            this[field] = 0
        }
      }
    })
  }

   public testMethod () {
     logger.info('I am inside the test method, i have been called')
   }

   public testPromise () {
     return new Promise((resolve, reject) => {
       setTimeout(() => {
       this.test = 'hello'
       }, 1000)
       resolve(true)
     })
   }

  /**
   * Defines and returns the schema for the Profile model
   * 
   * This method should never be called again as it used by the
   * Model method to result in a new model.
   * 
   * @return {*} mongoose.Schema  The schema for the profile model
   */
  // private Schema (): any {
  //   new mongoose.Schema({
  //     'name': {
  //       type: String,
  //       required: [true, 'Name has not been supplied'],
  //       minlength: [2, 'Name is too short and should be at least 2 characters in length'],
  //       maxlength: [140, 'Name is too long and should not exceed 140 characters'],
  //       validate: {
  //         validator: function (v) {
  //           return /.+[^\s]/.test(v)
  //         },
  //         message: props => `${props.value} is not set`
  //       }
  //     },
  //     'description': {
  //       type: String,
  //       required: false,
  //       maxlength: [400, 'Description is too long and should not exceed 400 characters']
  //     },
  //     'image': {
  //       type: String,
  //       required: true,
  //       lowercase: true,
  //       validate: {
  //         validator: function (v) {
  //           return /\.(jpg|jpeg|JPG|JPEG|png|PNG)$/.test(v)
  //         },
  //         message: props => `${props.value} is not a valid image extension`
  //       },
  //       minlength: [5, 'Image name is to small, therefore not a valid name'] //eg z.png
  //     }
  //   }, {timestamps: true})
  // }

  /**
   * Returns a model baseline
   * 
   * Used the schema to generate a model. Use this to create a model baseline
   * 
   * @return {*} Mongoose Model
   */
  // private Model (): any {
  //   return mongoose.model(this.tablename, this.Schema())
  // }

  /**
   * Create a profile model object
   * 
   * Used to create a model from data to then be saved into the database
   * 
   * @param {object} data Name, description?, and image location :/public/images/randomname.extension:
   * 
   * @return {object} @var Document The profile model
   */
  public create (data: {name: string, description?: string, image: string}): Document {
    logger.debug(data)
    const newProfile = new Document({
      name: data.name,
      description: data.description,
      image: data.image
    })
    this.fill(newProfile)
    return newProfile
  }

  /**
   * Insert a single record
   * 
   * @param {object} newProfile  The profile document instance holding name, description? and image path
   * 
   * @return {boolean} Result of it saving or not
   */
  public insertOne(newProfile: any): boolean {
    try {
      newProfile.save()
      this.fill(newProfile)
      return true
    } catch (err) {
      logger.error(`error saving a profile: ${err.message}`)
      return false
    }
  }

  /**
   * Find a profile by the id field
   * 
   * The id passed is converted to an object id if it isnt one,
   * so you dont need to worry about converting or resetting
   * 
   * @param {number} id The id of the profile to get
   * 
   * @return {Promise} Resolved if found a profile with the profile, rejected for anything else
   * 
   * todo :: this is asynchronous so when called from the constructor it needs a .then, find a synchronous method of
   */
  public async findOneById(id: number): Promise<any>  {
    return new Promise<boolean|object>((resolve, reject) => {
      try {
        // if the id isnt already an object id, convert it
        if (mongoose.Types.ObjectId.isValid(id) === false)
          id = new mongoose.Types.ObjectId(id)
      } catch (err) {
        logger.error(`failed convert ${id} to a mongoose object id`)
        reject(false)
      }
      Document.findOne({ _id: id }, (err: any, profile: any) => {
        if (err) {
          logger.error(`Problem finding a profile: ${err.message}`)
          reject(false)
        }
        // Check if data was pulled
        if (!profile) {
          logger.info(`No profile matched ${id}`)
          reject(false)
        }
        if (profile) {
          logger.debug('found a profile')
          resolve(profile)
        }
      })
    })
  }

  /**
   * Delete a profile by their id and empty the properties
   * 
   * @param id 
   */
  public deleteOneById (id: number) {
    return new Promise((resolve, reject) => {
      id = new mongoose.Types.ObjectId(id)
      // delete profile
      Document.deleteOne({ _id: id }, function (err: any) {
        if (err) {
          logger.error(err)
          reject(false)
        }
        logger.debug('seemed to delete one')
        resolve(true)
      })
    })
  }

  /**
   * Find 10 profiles
   * 
   * @return {promise} Resolved for profiles, rejected for anything else
   */
  public findTen () {
    return new Promise<object|boolean>((resolve, reject) => {
      logger.debug('Going to find ten profiles')
      Document.find({}).sort({'date': -1}).limit(10).exec((err: any, profiles: any) => {
        if (err) {
          logger.error(`Problem finding a profile: ${err.message}`)
          reject(false)
        }
        logger.info('Resolving profiles from the findTen method')
        profiles = this.validateOutputFields(profiles, this.fieldsToExpose)
        resolve(profiles)
      })
    })
  }

  /**
   * Get a profile by a name
   * 
   * @param {string} name Name of the profile to find 
   * 
   * @return {promise} Resolved if found, rejected if not
   */
  public getOneByName (name: string) {
    return new Promise((resolve, reject) => {
      Document.findOne({name: name}, (err: any, profile: any) => {
        if (err) {
          logger.error(err)
          reject(false)
        }
        this.fill(profile)
        resolve(true)
      })
    })
  }
}

module.exports = ProfileModel