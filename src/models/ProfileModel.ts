import {types} from "util";
// import isModuleNamespaceObject = module
// import validate = WebAssembly.validate;
// import { Schema } from "inspector";
// import { FILE } from "dns";

const mongoose = require('mongoose')
const logger = require('../helpers/logger')
const BaseModel = require('/var/www/juanportal/models/BaseModel')
const BaseModelInterface = require('../interfaces/models/BaseModelInterface')

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
 * @property {number} public _id ID of profile from the database
 * @property {string} public name Name of the profile from the database
 * @property {string} pulbic description Description of the profile from the database
 * @property {string} public image Image path of the profile from the database
 * @property {string} private tablename The name of the related database table
 * @property {string[]} private fieldsToExpose The list of allowed fields to be assigned to this object
 * 
 * @method create Create a profile object
 * @method insertOne Insert a profile
 * @method findOneById Find a profile by their id
 * @method deleteOneById Delete a profile by their id
 * @method findTen Find the top 10 profiles
 * @method getOneByName Get a profile by their name  
 * 
 * @method fill Fill this object with database data
 * @method empty Empty this object       
 * @method validateOutputFields Strip unneeded properties from a retrieved document
 * @method validateInputFields Validate data before saving it to the db                                  
 */
class ProfileModel extends BaseModel implements BaseModelInterface {

  /**
   * Id of the profile model
   * 
   * @var {string} _id
   */
  public _id: string = ''

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
  public readonly tablename: string = 'Profile'

  /**
   * Fields in the database to be assigned to this model
   * 
   * Sometimes we dont want to retrieve sensitive data,
   * this allows us to map database columns to the model
   * 
   * @var {string[]} fieldsToExpose
   */
  public readonly fieldsToExpose: string[] = [
      '_id',
      'name',
      'description',
      'image'
  ]

  /**
   * Create a profile model object
   * 
   * Used to create a model from data to then be saved into the database
   * 
   * @method create
   * 
   * @example const Profile = new ProfileModel; const newProfile = Profile.create(...)
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
    this.empty(this.fieldsToExpose)
    this.fill(newProfile)
    return newProfile
  }

  /**
   * Insert a single record
   * 
   * @method insertOne
   * 
   * @example const saved: boolean = Profile.insertOne(newProfile);
   * 
   * @param {object} newProfile  The profile document instance holding name, description? and image path
   * 
   * @return {boolean} Result of it saving or not
   */
  public insertOne(newProfile: any): boolean {
    try {
      newProfile.save()
      this.empty(this.fieldsToExpose)
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
  public findOneById(id: number): Promise<any>  {
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
          this.empty(this.fieldsToExpose)
          this.fill(profile)
          resolve(profile)
        }
      })
    })
  }

  /**
   * Delete a profile by their id and empty the properties
   * 
   * @method deleteOneById
   * 
   * @example Profile.deleteOneById(id).then((success) => { console.log(`User deleted: ${success}`)})
   * 
   * @param {number} id Id of the profile to delete
   * 
   * @return {Promise} False or true, depending on the success
   */
  public deleteOneById (id: number) {
    return new Promise((resolve, reject) => {
      id = new mongoose.Types.ObjectId(id)
      // delete profile
      Document.deleteOne({ _id: id }, (err: any) => {
        if (err) {
          logger.error(err)
          reject(false)
        }
        this.empty(this.fieldsToExpose)
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
        this.empty(this.fieldsToExpose)
        this.fill(profile)
        resolve(true)
      })
    })
  }
}

module.exports = ProfileModel