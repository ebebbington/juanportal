import express from 'express'

const ProfileModel = require('../models/ProfileModel')
const logger = require('../helpers/logger')
const ImageHelper = require('../helpers/ImageHelper')

// todo :: make this globally available for all controlelrs
interface IData {
  success: boolean,
  message: string,
  data: any
}

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
        return res.status(400).json({success: false, message: 'No count was passed in'})
      }

      const parsedCount: any = parseInt(req.params.count)
      if (isNaN(parsedCount)) {
        logger.error(`Cannot parse the count param of ${req.params.count} param to an int`)
        return res.status(400).json({success: false, message: 'Failed to parse the count to a number'})
      }

      const count: number = parseInt(req.params.count)
      if (count < 1) {
        logger.error(`Count was less than 1, and is ${count}`)
        return res.status(400).json({success: false, message: 'Number of requested profiles did not meet the minimum of 1'}).end()
      }

      //
      // Get profiles by count
      // 

      const profiles: Promise<object|Array<object>> = await ProfileModel.findManyByCount(count)

      if (!profiles || !profiles.length) {
        logger.error('No profiles were found')
        return res.status(404).json({success: false, message: 'No profiles were found'}).end()
      }

      if (profiles) {
        logger.info(`Profiles with a length of ${profiles.length} were found`)
        return res.status(200).json({success: true, message: 'Grabbed profiles', data: profiles})
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
          return res.status(400).json({success: false, message: 'Failed to parse the id to a number'})
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
          const result: {
            success: boolean,
            message: string,
            data: {
              _id: string,
              name: string,
              description: string,
              image: string
            }
          } = {
            success: true,
            message: 'Successfully got profile',
            data: {
              _id: Profile._id,
              name: Profile.name,
              description: Profile.description,
              image: Profile.image
            }
          }
          return res.status(200).json(result).end()
        }
        // todo :: change the below to check success instead
        if (!Profile._id) {
          logger.error('No profile was found')
          return res.status(404).json({success: false, message: 'Couldnt find a profile'}).end()
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
            return res.status(400).json({success: false, message: 'Failed to parse the id to a number'})
        }

        //
        // Check if they exist
        //
        const Profile = new ProfileModel
        await Profile.findOneById(req.params.id)
        const exists = await ProfileModel.existsByName(Profile.name)
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
            return res.status(200).json({success: true, message: 'Successfully deleted'}).end()
        }
        if (!success) {
          logger.error(`Failed to delete the profile with id ${id}`)
            return res.status(500).json({success: false, message: 'Failed to delete'}).end()
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
                message: 'User already exists',
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