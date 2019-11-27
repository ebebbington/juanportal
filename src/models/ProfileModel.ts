import {types} from "util";
import isModuleNamespaceObject = module
import validate = WebAssembly.validate;
import { Schema } from "inspector";
import { FILE } from "dns";

const mongoose = require('mongoose')
const logger = require('../helpers/logger')
const util = require('util')
const BaseModel = require('BaseModel.js')
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
 * 
 * @example
 *    // When wanting to save a new user
 *    const newProfile = new ProfileModel({name, descr, image})
 *    // When getting a user
 *    const ProfileModel = new ProfileModel;
 *    const profile = ProfileMode.find...
 */
class ProfileModel<BaseModelInterface> extends BaseModel {

  public name: string

  public description: string

  public image: string

  private readonly tablename: string

  private readonly fieldsToExpose: string[] = [
      '_id',
      'name',
      'description',
      'image'
  ]

  /**
   * Sets the fillable fields if defined, and if so, then
   * it creates a model to use e.g. when wanting to add a user
   * 
   * @param {object} props Contains the name, description and image on register
   */
  constructor(props: any) {
    super(props)
    this.name = props.name
    this.description = props.description
    this.image = props.image
    this.tablename = 'Profile'
    if (props)
      this.create()
  }

  /**
   * Defines and returns the schema for the Profile model
   * 
   * This method should never be called again as it used by the
   * Model method to result in a new model.
   * 
   * @return {*} mongoose.Schema  The schema for the profile model
   */
  private Schema (): any {
    return new mongoose.Schema({
      'name': {
        type: String,
        required: [true, 'Name has not been supplied'],
        minlength: [2, 'Name is too short and should be at least 2 characters in length'],
        maxlength: [140, 'Name is too long and should not exceed 140 characters'],
        validate: {
          validator: function (v) {
            return /.+[^\s]/.test(v)
          },
          message: props => `${props.value} is not set`
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
          validator: function (v) {
            return /\.(jpg|jpeg|JPG|JPEG|png|PNG)$/.test(v)
          },
          message: props => `${props.value} is not a valid image extension`
        },
        minlength: [5, 'Image name is to small, therefore not a valid name'] //eg z.png
      }
    }, {timestamps: true})
  }

  /**
   * Returns a model baseline
   * 
   * Used the schema to generate a model. Use this to create a model baseline
   * 
   * @return {*} Mongoose Model
   */
  private Model (): any {
    return mongoose.model(this.tablename, this.Schema())
  }

  /**
   * Create a profile model object
   * 
   * Used to create a model from data to then be saved into the database
   * 
   * @return {obejct} The profile model
   */
  private create (): any {
    const Model = this.Model()
    const newProfile = new Model({
      name: this.name,
      description: this.description,
      image: this.image
    })
    return newProfile
  }

  /**
   * Insert a single record
   * 
   * @param {object} newProfile 
   * 
   * @return {boolean} Result of it saving or not
   */
  public insertOne(newProfile: any): boolean {
    try {
      newProfile.save()
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
   */
  public findOneById(id: number)  {
    return new Promise<boolean|object>((resolve, reject) => {
      try {
        // if the id isnt already an object id, convert it
        if (mongoose.Types.ObjectId.isValid(id) === false)
          id = new mongoose.Types.ObjectId(id)
      } catch (err) {
        logger.error(`failed convert ${id} to a mongoose object id`)
        reject(false)
      }
      const Model = this.Model()
      Model.findOne({ _id: id }, (err: any, profile: any) => {
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
          profile = this.validateOutputFields(profile, this.fieldsToExpose)
          resolve(profile)
        }
      })
    })
  }

  /**
   * Delete a profile by their id
   * 
   * @param id 
   */
  public deleteOneById (id: number) {
    return new Promise((resolve, reject) => {
      try {
        // if the id isnt already an object id, convert it
        if (mongoose.Types.ObjectId.isValid(id) === false)
          id = new mongoose.Types.ObjectId(id)
      } catch (err) {
        logger.error(`failed convert ${id} to a mongoose object id`)
        reject(false)
      }
      // delete profile
      const Model = this.Model()
      Model.deleteOne({ _id: id }, function (err: any) {
        if (err) {
          logger.error(err)
          reject(false)
        }
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
      const Model = this.Model()
      Model.find({}).sort({'date': -1}).limit(10).exec((err: any, profiles: any) => {
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
      const Model = this.Model()
      Model.findOne({name: name}, (err: any, profile: any) => {
        if (err) {
          logger.error(err)
          reject(false)
        }
        profile = this.validateOutputFields(profile, this.fieldsToExpose)
        resolve(profile)
      })
    })
  }
}

module.exports = ProfileModel