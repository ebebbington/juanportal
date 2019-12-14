import {types} from "util";
import { pathToFileURL } from "url";
import e = require("express");
// import isModuleNamespaceObject = module
// import validate = WebAssembly.validate;
// import { Schema } from "inspector";
// import { FILE } from "dns";

const mongoose = require('mongoose')
const logger = require('../helpers/logger')
const BaseModel = require('./BaseModel')
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
      message: (props: { value: any; }) => 'Image does not have a valid extension. Please use: .jpg, .jpeg or .png'
    },
    minlength: [5, 'Image name is to small, therefore not a valid name'] //eg z.png
  }
}, {timestamps: true})

// Schema.pre('save', function (next: any)  {
//   const self: any = this
//   Document.findOne({name: self.name}, function (err: any, profile: any) {
//     console.log(err)
//     console.log(profile)
//     if (!profile) {
//       next() 
//     } else {
//       logger.error('user already exists')
//       console.log('inside save vlidation schema')
//     }
//   })
// })
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
 * @method deleteManyById Delete all profiles by id
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
  public async create (data: {name: string, description?: string, image: string}) {
    const newProfile = new Document({
      name: data.name,
      description: data.description,
      image: data.image
    })
    console.log('Inside create method, heres the data:')
    console.log(newProfile)
    const errors = newProfile.validateSync()
    if (errors) {
      console.log('there were errors when validation profile')
      return errors
    }
    if (!errors) {
      console.log('no errors when validation')
      newProfile.save()
      console.log('seemed to save')
      this.empty(this.fieldsToExpose)
      this.fill(newProfile)
    }
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
  // public insertOne(newProfile: any): boolean {
  //   try {
  //     newProfile.save()
  //     this.empty(this.fieldsToExpose)
  //     this.fill(newProfile)
  //     return true
  //   } catch (err) {
  //     logger.error(`error saving a profile: ${err.message}`)
  //     return false
  //   }
  // }

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
  public async findOneById(id: number): Promise<any>  {
    id = this.getObjectId(id)
    if (!id) {
      return false
    }
    const profile = await Document.findOne({ _id: id })
    // check for an empty response
    console.log('the profile')
    console.log(profile)
    if (Array.isArray(profile) && !profile.length) {
      // empty
      return false
    } else {
      this.empty(this.fieldsToExpose)
      this.fill(profile)
      return true
    }
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
   * Delete profiles by their id and empty the properties
   * 
   * @method deleteManyById
   * 
   * @example Profile.deleteManyById(id).then((success) => { console.log(`User deleted: ${success}`)})
   * 
   * @param {number} id Id of the profile to delete
   * 
   * @return {Promise} False or true, depending on the success
   */
  public deleteManyById (id: number) {
    return new Promise((resolve, reject) => {
      id = new mongoose.Types.ObjectId(id)
      // delete profile
      Document.deleteMany({ _id: id }, (err: any) => {
        if (err) {
          logger.error(err)
          reject(false)
        }
        this.empty(this.fieldsToExpose)
        logger.debug('seemed to delete many')
        resolve(true)
      })
    })
  }

  /**
   * Delete many profiles by their name
   * 
   * @param {string} name Name of the profile to delete 
   */
  public static async deleteOneByName (name: string) {
    await Document.deleteOne({name: name})
  }

  public static async createMany (docs: [{name: string, description?: string, image: string}]) {
    if (!docs || !docs.length) {
      return true
    }
    let newProfiles = Document.create(docs)
    // create the docs
    // docs.forEach((profile: {name: string, description?: string, image: string}) => {
    //   const newProfile = new Document({
    //     name: profile.name,
    //     description: profile.description,
    //     image: profile.image
    //   })
    //   newProfiles.push(newProfile)
    // })

    // validate each profile
    // const errors = newProfiles.forEach((profile: any) => {
    //   const err = profile.validateSync()
    //   if (err) {
    //     return err
    //   }
    // })
    // if (errors) {
    //   return errors
    // }

    // insert
    // if (!errors) {
      // console.log('no errors when validation')
      console.log('going to insert many with a len of: ' + docs.length)
      const errors = await Document.insertMany(docs)
      console.log(errors)

      console.log('seemed to save')
      return false
    // }
  }

  /**
   * Find many profiles by a specified amount
   * 
   * @param {number} amount  The amount of profiles to find
   * 
   * @return {[{}]} Profiles or false if not found any
   */
  public static async findManyByCount (amount: number) {
      logger.debug('Going to find many profiles')
      console.log(amount)
      const profiles: any = await Document.find({}).sort({'date': -1}).limit(amount)
      console.log(profiles)
      return profiles
  }

  /**
   * Check if a profile exists by their name
   * 
   * @param {string} name Name of the profile to find
   * 
   * @return {boolean}
   */
  public static async existsByName (name: string) {
    const profile = await Document.findOne({name: name})
    console.info('showing res from exists function')
    console.info(profile)
    return profile ? true : false
  }

  /**
   * Get a profile by a name
   * 
   * @param {string} name Name of the profile to find 
   * 
   * @return {promise} Resolved if found, rejected if not
   */
  public async findOneByName (nameOfProfile: string) {
    console.log('entered findOneByName')
      const profile = await Document.findOne({name: nameOfProfile})
      if (Array.isArray(profile) && !profile.length || !profile) {
        logger.debug('Empty result from findonevbyname')
        // empty
        return false
      } else {
        logger.debug('Found a profile in findonebyname: ')
        logger.debug(profile)
        this.empty(this.fieldsToExpose)
        this.fill(profile)
        return true
      }
  }

  /**
   * Find many profiles by their name
   * 
   * @param name Name of the profiles to find
   * 
   * @return {[{}]} Profiles found
   */
  public async findManyByName (name: string) {
    const profiles = await Document.find({name: name})
    return profiles
  }
}

module.exports = ProfileModel