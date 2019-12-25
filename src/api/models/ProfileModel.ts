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
import {IBaseModel} from '../interfaces/models/BaseModelInterface'
import { promises } from "dns";
const Document = require('../schemas/ProfileSchema')

/**
 * @class ProfileModel
 * 
 * @author Edward Bebbington
 * 
 * @extends BaseModel
 * 
 * @implements IBaseModel
 *
 * @property {number}     _id             ID of profile from the database
 * @property {string}     name            name Name of the profile from the database
 * @property {string}     description     description Description of the profile from the database
 * @property {string}     image           image Image path of the profile from the database
 * @property {string}     tablename       tablename The name of the related database table
 * @property {string[]}   fieldsToExpose  fieldsToExpose The list of allowed fields to be assigned to this object
 * @property {string}     created_at      When the document was created
 * @property {string}     updated_at      When the document was last updated
 * 
 * 
 * @method create                 Create a profile object
 * @method findOneById            Find a profile by id
 * @method deleteOneById          Delete a profile by their id
 * @method deleteAll
 * @method deleteAllByName        Delete all profiles by name
 * @method deleteOneByName        Delete one by name
 * @method findManyByCount        Find a defined number of profiles
 * @method existsByName           Check if profiles exists
 * @method findOneByName          Find one by name
 * @method findManyByName         Find many by name
 * @method getMongooseDocument    Retrieve the mongoose document
 * 
 * @method fill                   Fill this object with database data
 * @method empty                  Empty this object       
 * @method validateOutputFields   Strip unneeded properties from a retrieved document
 * @method validateInputFields    Validate data before saving it to the db                                  
 */
class ProfileModel extends BaseModel implements IBaseModel {

  /**
   * Id of the profile model
   * 
   * @var {string|null} _id
   */
  public _id: string|null = ''

  /**
   * Name field of the profile model
   * 
   * @var {string|null} name
   */
  public name: string|null = ''

  /**
   * Description field of the profile model
   * 
   * @var {string|null} description
   */
  public description: string|null = ''

  /**
   * Image field of the profile model
   * 
   * @var {string|null} image
   */
  public image: string|null = ''

  /**
   * When the entry was created
   * 
   * @var {string|null} created_at
   */
  public readonly created_at: string|null = ''
  
  /**
   * When the entry was updated
   * 
   * @var {string|null} updated_at
   */
  public readonly updated_at: string|null = ''

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

  // constructor (id: number) {
  //   super(id)
  //   //@ts-ignore
  //   return (async () => {
  //     await this.findOneById(id)
  //     return this
  //   })()
  // }

  /**
   * Get the mongoose document of this model
   * 
   * This is here so in the BaseModel, it can call 'this' method to get the document
   *
   * @return {Document} The mongoose document from the schema
   */
  protected getMongooseDocument (): Document {
    return Document
  }

  /**
   * Create a profile model object
   * 
   * @requires getMongooseDocument Children must add this method and return their Document
   * 
   * Used to create a model from data to then be saved into the database
   * 
   * @method create
   * 
   * @example
   * const Profile = new ProfileModel;
   * const newProfile = Profile.create(...)
   * 
   * @param {name: string, description?: string, image: string} data
   * 
   * @return {void|object} Return value is set if validation errors are returned
   */
  public async create (data: {name: string, description?: string, image: string}): Promise<any> {
    const newProfile = new Document({
      name: data.name,
      description: data.description,
      image: data.image
    })
    try {
      await newProfile.save()
      this.empty()
      this.fill(newProfile)
      logger.info(`[ProfileModel - create: filled the model]`)
    } catch (validationError) {
      const fieldName: string = Object.keys(validationError.errors)[0]
      const errorMessage: string = validationError.errors[fieldName].message
      logger.error(`Validation error: ${errorMessage}`)
      return validationError
    }
  }

  /**
   * Find a profile by the id field
   * 
   * The id passed is converted to an object id if it isnt one,
   * so you dont need to worry about converting or resetting
   * 
   * @method findOneById
   * 
   * @param {number} id The id of the profile to get
   * 
   * @return {boolean} True if found a profile, else false for an empty response or unable to convert id
   */
  public async findOneById(id: number): Promise<boolean>  {
    id = this.generateObjectId(id)
    if (!id) {
      return false
    }
    const profile = await Document.findOne({ _id: id })
    // check for an empty response
    if (Array.isArray(profile) && !profile.length || !profile) {
      // empty
      return false
    } else {
      this.empty()
      this.fill(profile)
      return true
    }
  }

  /**
   * Delete a profile by their id and empty the properties
   * 
   * @method deleteOneById
   * 
   * @example
   * const success = Profile.deleteOneById(id)
   * 
   * @param {number} id Id of the profile to delete
   * 
   * @return {boolean} False or true, depending on the success
   */
  public async deleteOneById (id: number): Promise<boolean> {
    id = this.generateObjectId(id)
    if (!id) {
      return false
    }
    const res = await Document.deleteOne({ _id: id })
    if (res.ok === 1) {
      this.empty()
      return true
    } else {
      return false
    }
  }

  /**
   * DO NOT TOUCH THIS
   *
   * @return {your demise and an eternity in hell}
   */
  // todo :: remove me once ive addressed the other fixme's regarding this method, mainly when ive found to test an already populated database if its empty by not actually remvoign data
  public static async deleteAll (key: string): Promise<boolean> {
    const lock: string = 'Somesuperlongparameterbecauseyouneedtopassoneintothefunctionforittoworkandifyoudontitfailswhichsecuresthefunctionsoifsomeonedidwanttocallthisfunctionthentheyaregoingtohavetocopythisparametertomakeitliterallyimpossibletowriteintoanactuallyapplication'
    if (lock !== key) {
      return false
    }
    await Document.deleteMany({})
    return true
  }

  /**
   * Delete all profiles by name. Only used for testing purposes
   * 
   * @method deleteAllByName
   * 
   * @example
   * const success = await ProfileModel.deleteAllByName('ed')
   * 
   * @param {string} name Name of the profiles to delete
   * 
   * @return {boolean} if it succeeded and no profiles are left
   */
  public static async deleteAllByName (name: string): Promise<boolean> {
    const res = await Document.deleteMany({name: name})
    if (res.ok === 1) {
      return true
    } else {
      return false
    }
  }

  /**
   * Delete many profiles by their name
   * 
   * @method deleteOneByName
   * 
   * @example
   * const Profile = new ProfileModel
   * const success = Profile.deleteOneByName('ed')
   * 
   * @param {string} name Name of the profile to delete 
   * 
   * @return {boolean} success result
   */
  public async deleteOneByName (name: string): Promise<boolean> {
    const res = await Document.deleteOne({name: name})
    if (res.ok === 1) {
      this.empty()
      return true
    } else {
      return false
    }
  }

  /**
   * Find many profiles by a specified amount
   * 
   * @method findManyByCount
   * 
   * @example
   * const profiles: [objects] = ProfileModel.findManyByCount(102) 
   * 
   * @param {number} amount  The amount of profiles to find
   * 
   * @return {[profiles]|boolean} array of profiles or empty array
   */
  public static async findManyByCount (amount: number): Promise<boolean|Array<any>> {
    if (!amount) {
      logger.error('[ProfileModel findManyByCount - Param isnt defined')
      return false
    }
    const cap = 100
    if (amount > cap) amount = cap
    const profiles: any = await Document.find({}).sort({'date': -1}).limit(amount)
    // convert to array if only one is found
    if (Array.isArray(profiles) && !profiles.length || !profiles) {
      return false
    }
    if (!profiles.length)
      return [profiles]
    return profiles
  }

  /**
   * Check if a profile exists by their name
   * 
   * @method existsByName
   * 
   * @example
   * const exists = ProfileModel.existsByName('ed'); // true | false
   * 
   * @param {string} name Name of the profile to find
   * 
   * @return {boolean} if they exist
   */
  public static async existsByName (name: string): Promise<boolean> {
    const profile = await Document.findOne({name: name})
    return profile ? true : false
  }

  /**
   * Get a profile by a name
   * 
   * @method findOneByName
   * 
   * @example
   * const Profile = new ProfileModel
   * const success = await Profile.findOneByName('ed')
   * 
   * @param {string} name Name of the profile to find 
   * 
   * @return {boolean} is profile was found
   */
  public async findOneByName (nameOfProfile: string): Promise<boolean> {
      const profile = await Document.findOne({name: nameOfProfile})
      if (Array.isArray(profile) && !profile.length || !profile) {
        // empty
        return false
      } else {
        this.empty()
        this.fill(profile)
        return true
      }
  }

  /**
   * Find many profiles by their name
   * 
   * @method findManyByName
   * 
   * @example
   * const profiles = await ProfileModel.findManyByName('ed')
   * 
   * @param name Name of the profiles to find
   * 
   * @return {boolean|[profiles]} Profiles found
   */
  public static async findManyByName (name: string): Promise<boolean|Array<any>> {
    const profiles = await Document.find({name: name})
    if (Array.isArray(profiles) && !profiles.length || !profiles) {
      // empty
      return false
    }
    if (Array.isArray(profiles)) {
      return profiles
    } else {
      return [profiles]
    }
  }
}

module.exports = ProfileModel