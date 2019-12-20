import express from 'express'

const ProfileModel = require('../models/ProfileModel')
const logger = require('../helpers/logger')
const ImageHelper = require('../helpers/ImageHelper')
import {IData} from '../interfaces/controllers/DataInterface'

// todo :: How can i add an interface to res.json so it implements IData?
// app.use(function(req, res, next) {
//   var json = res.json;
//   res.json = function(obj) {
//       function delete_null_properties(obj) {
//           // ...
//       }
//       delete_null_properties(obj);

//       json.call(this, obj);
//   };
//   next();
// });

/**
 * @class ProfileController
 *
 * @author Edward Bebbington
 *
 * @method get
 * @method post
 * @method delete
 * @method update
 *
 * @example
 *    const ProfileController = require('...ProfileController')
 *    ProfileController.DoSomething
 */
class ProfileController {
    
    /**
     * Retrieve a defined amount of  profiles in date order by req.params.count
     *
     * @param {express.Request}   req   Request object
     * @param {express.Response}  res   Response object
     * @param {Function}          next  Callback
     * 
     * @return {express.Response} res
     */
    public static async GetProfilesByAmount(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, next: Function) {
      logger.info('[Profile Controller - GetProfilesByAmount]')

      //
      // Checks
      //

      if (!req.params.count) {
        logger.error('Count was not passed in')
        const data: IData = {
          success: false,
          message: 'No count was passed in',
          data: null
        }
        return res.status(400).json(data)
      }

      const parsedCount: any = parseInt(req.params.count)
      if (isNaN(parsedCount)) {
        logger.error(`Cannot parse the count param of ${req.params.count} param to an int`)
        const data: IData = {
          success: false,
          message: 'Failed to parse the count to a number',
          data: null
        }
        return res.status(400).json(data)
      }

      const count: number = parseInt(req.params.count)
      if (count < 1) {
        logger.error(`Count was less than 1, and is ${count}`)
        const data: IData = {
          success: false,
          message: 'Number of requested profiles did not meet the minimum of 1',
          data: null
        }
        return res.status(400).json(data).end()
      }

      //
      // Get profiles by count
      // 

      const profiles: Promise<object|Array<object>> = await ProfileModel.findManyByCount(count)

      if (!profiles || !profiles.length) {
        logger.error('No profiles were found')
        const data: IData = {
          success: false,
          message: 'No profiles were found',
          data: null
        }
        return res.status(404).json(data).end()
      }

      if (profiles) {
        logger.info(`Profiles with a length of ${profiles.length} were found`)
        const data: IData = {
          success: true,
          message: 'Grabbed profiles',
          data: profiles
        }
        return res.status(200).json(data)
      }

    }

    /**
     * Get a Profile by an id (the _id field of the document)
     * 
     * @param {express.Request}   req   Request object
     * @param {express.Response}  res   Response object
     * @param {Function}          next  Callback
     * 
     * @return {express.Response} res
     */
    public static async GetProfileById(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, next: Function) {
      logger.info('[Profile Controller - GetProfileById]')

      //
      // Checks
      //

      const parsedId: any = parseInt(req.params.id)
      if (isNaN(parsedId)) {
        logger.error(`The id of ${req.params.id} cannot be parsed to an int`)
        const data: IData = {
          success: false,
          message: 'Failed to parse the id to a number',
          data: null
        }
         return res.status(400).json(data)
      }

      //
      // Get the profile
      //

      const id: string = req.params.id
      const Profile = new ProfileModel
      const success: boolean = await Profile.findOneById(id)
      // todo :: change to below to check success instead
      if (Profile._id) {
        logger.info('A profile was found')
        const data: IData = {
          success: true,
          message: 'Successfully got profile',
          data: {
            _id: Profile._id,
            name: Profile.name,
            description: Profile.description,
            image: Profile.image
          }
        }
        return res.status(200).json(data).end()
      }
      // todo :: change the below to check success instead
      if (!Profile._id) {
        logger.error('No profile was found')
        const data: IData = {
          success: false,
          message: 'Couldnt find a profile',
          data: null
        }
        return res.status(404).json(data).end()
      }
    }

    /**
     * Delete a profile by an id
     * 
     * @param {express.Request}   req   Request object
     * @param {express.Response}  res   Response object
     * @param {Function}          next  Callback
     * 
     * @return {express.Response} res
     */
    public static async DeleteProfileById (req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, next: Function) {
      logger.info('[ProfileController - DeleteProfileById]')

      //
      // Checks
      //

      const parsedId: any = parseInt(req.params.id)
      if (isNaN(parsedId)) {
        logger.error(`Couldnt parse ${req.params.id} into a number`)
        const data: IData = {
          success: false,
          message: 'Failed to parse the id to a number',
          data: null
        }
        return res.status(400).json(data)
      }

      //
      // Check if they exist
      //

      const Profile = new ProfileModel
      await Profile.findOneById(req.params.id)
      const exists: boolean = await ProfileModel.existsByName(Profile.name)
      if (!exists) {
        logger.error(`The profile you are trying to delete doesnt exist, with the id of ${req.params.id}`)
        const data: IData = {
          success: false,
          message: 'Profile doesnt exist',
          data: null
        }
        return res.status(404).json(data)
      }

      //
      // Delete the profile
      //

      const id: string = req.params.id
      const success: boolean = await Profile.deleteOneById(id)
      if (success) {
        logger.info(`Deleted the profile with id ${id}`)
        const data: IData = {
          success: true,
          message: 'Successfully deleted',
          data: null
        }
        return res.status(200).json(data).end()
      }
      if (!success) {
        logger.error(`Failed to delete the profile with id ${id}`)
        const data: IData = {
          success: true,
          message: 'Failed to delete',
          data: null
        }
        return res.status(500).json(data).end()
      }
    }

    /**
     * Create a profile
     * 
     * @param {express.Request}   req   Request object
     * @param {express.Response}  res   Response object
     * @param {Function}          next  Callback
     * 
     * @return {express.Response} res
     */
    public static async PostProfile (req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, next: Function) {
      logger.info('[ProfileController - PostProfile]')

      //
      // Check, get and create the image filename
      //

      // todo :: i feel this section could be reworked
      const Image = new ImageHelper;
      let imageFileName: string = 'sample.jpg'
      if (req.file) {
        logger.info('A file was passed in')
        imageFileName = req.file.originalname
      } else {
        logger.info('A file was not passed in')
      }
      imageFileName = Image.createNewFilename(imageFileName)

      //
      // Check profile doesnt already exist
      //

      // todo :: maybe this could end up being done as part of the model validation? is there a better way to implement this?
      const exists: boolean = await ProfileModel.existsByName(req.body.name)
      if (exists) {
        logger.error(`Profile with the name ${req.body.name} already exists`)
        const data: IData = {
          success: false,
          message: 'Profile already exists',
            data: null
        }
        return res.status(400).json(data).end()
      }
      logger.info(`Profile with the name ${req.body.name} doesnt already exist`)

      //
      // Create and Validate the Profile
      //

      const Profile = new ProfileModel
      const validationError: any = await Profile.create({
          name: req.body.name,
          description: req.body.description,
          image: '/public/images/' + imageFileName
      })
      if (validationError) {
        logger.error('There was a validation error')
        const fieldName: string = Object.keys(validationError.errors)[0]
        const errorMessage: string = validationError.errors[fieldName].message
        const data: IData = {
            success: false,
            message: errorMessage,
            data: fieldName
        }
        return res.status(400).json(data).end()
      }
      logger.info(`Profile with the name ${req.body.name} passed validation`)

      //
      // Check the database was updated
      //

      // todo :: maybe a better way to implement this?
      await Profile.findOneByName(req.body.name)
      if (Profile.name === req.body.name) {
        logger.info('The profile did save to the database')
        const data: IData = {
          success: true,
          message: 'Saved the profile',
          data: '/public/images/' + imageFileName
        }
        return res.status(200).json(data)
      } else {
        logger.error('The database wasnt updated with the new profile')
        const data: IData = {
          success: false,
          message: 'Could not save the profile',
          data: null
        }
        return res.status(500).json(data).end()
      }
    }
}

module.exports = ProfileController