import {promises, resolveSoa} from "dns"
const _ = require('lodash')
const fs = require('fs')
const util = require('util')
import express from 'express'

import { endianness } from "os"
const mongoose = require('mongoose')


const app = express()
const ProfileModel = require('../models/ProfileModel')
const logger = require('../helpers/logger')
const ImageHelper = require('../helpers/ImageHelper')
const JWT = require('../helpers/JWT')


// For when an image is submited in the form when POSTing a profile
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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
 *    ProfileController.get
 * 
 * Had to write this class this way so i can implement static methods
 */
class ProfileController { // cant implement the interfCE UNTIL ts ALLOWS STATIC METODS IN AN INTERFACE, also this will error when requiring it, but it wont if we remove the import statement from the interface file, but even then TS throws errors when using const express = ...
    
    /**
     * Get a single profile matching an id
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return response
     */
    public static async GetProfilesByAmount(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, next: Function) {
        // Check a param is passed in AND we can parse it
      if (!req.params.count) {
        return res.status(400).json({success: false, message: 'No count was passed in'})
      }
      const parsedCount = parseInt(req.params.count)
      if (isNaN(parsedCount)) {
        return res.status(400).json({success: false, message: 'Failed to parse the count to a number'})
      }
      const count = parseInt(req.params.count)
      if (count < 1) {
        return res.status(400).json({success: false, message: 'Number of requested profiles did not meet the minimum of 1'}).end()
      }
      const profiles = await ProfileModel.findManyByCount(count)
      logger.debug(profiles)
      if (!profiles || !profiles.length) {
        return res.status(404).json({success: false, message: 'No profiles were found'}).end()
      }
      if (profiles) {
        return res.status(200).json({success: true, message: 'Grabbed profiles', data: profiles})
      }
    }

    public static async GetProfileById(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, next: Function) {
      logger.debug('[Profile Controller - GetProfileById]')
        const parsedId = parseInt(req.params.id)
        if (isNaN(parsedId)) {
          return res.status(400).json({success: false, message: 'Failed to parse the id to a number'})
        }
        const id = req.params.id
        const Profile = new ProfileModel
        const success = await Profile.findOneById(id)
        if (Profile._id) {
          const result = {
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
        if (!Profile._id) {
          return res.status(404).json({success: false, message: 'Couldnt find a profile'}).end()
        }
    }

    public static async DeleteProfileById (req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, next: Function) {
        const parsedId = parseInt(req.params.id)
        if (isNaN(parsedId)) {
            return res.status(400).json({success: false, message: 'Failed to parse the id to a number'})
        }
        const id = req.params.id
        const Profile = new ProfileModel
        const success = await Profile.deleteOneById(id)
        if (success) {
            return res.status(200).json({success: true, message: 'Successfully deleted'}).end()
        }
        if (!success) {
            return res.status(500).json({success: false, message: 'Failed to delete'}).end()
        }
    }

    public static async PostProfile (req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, next: Function) {
        // Create the file name
        const Image = new ImageHelper;
        let imageFileName = 'sample.jpg'
        // @ts-ignore: Unreachable code error
        if (req.file) {
            // @ts-ignore: Unreachable code error
            imageFileName = req.file.originalname
        }
        imageFileName = Image.createNewFilename(imageFileName)

        // Check they dont already exist
        const exists = await ProfileModel.existsByName(req.body.name)
        logger.debug(`exists: ${exists}`)
        if (exists === true) {
            const data = {
                success: false,
                message: 'User already exists'
            }
            return res.status(400).json(data).end()
        }

        // Create data
        const Profile = new ProfileModel
        const validationError = await Profile.create({
            name: req.body.name,
            description: req.body.description,
            image: '/public/images/' + imageFileName
        })

        // Check any validation errors
        if (validationError) {
        const fieldName = Object.keys(validationError.errors)[0]
        const errorMessage = validationError.errors[fieldName].message
        const data = {
            success: false,
            message: errorMessage,
            data: fieldName
        }
        return res.status(400).json(data).end()
        }

        // Create the JWT
        // const token = JWT.createToken({ name: Profile.name })
        // if (!token) {
        //   return res.status(500).json({success: false, message: 'Tried creating a JWT but it couldnt be set', data: token})
        // }
        // logger.info('Created a token on POST /profile: ' + token)

        // Make sure the profile was added
        await Profile.findOneByName(req.body.name)
        if (Profile.name === req.body.name) {
        logger.debug('User saved to database')
        return res.status(200).json({success: true, message: 'Saved to the database', data: '/public/images/' + imageFileName})
        } else {
        logger.error('didnt save a profile')
        return res.status(500).json({succesS: false, message: 'Profile did not save correctly'}).end()
        }
        // // Save the user
        // const saved = Profile.insertOne(newProfile)
        // if (!saved) {
        //     logger.error('didnt save a profile')
        //     return res.status(500).json({succesS: false, message: 'Profile did not save correctly'}).end()
        // }
        // if (saved) {
        //     logger.debug('User saved to database')
        //     return res.status(200).json({success: true, message: 'Saved to the database', data: newProfile.image})
        //     // @ts-ignore: Unreachable code error
        //     // const fileSaved = Image.saveToFS(imageFileName, req.file)
        //     // logger.debug(['status of filesaved', fileSaved])
        //     // if (fileSaved) {
        //     //     logger.debug('FILE DIDSAVE')
        //     //     const data = {
        //     //         success: true,
        //     //         message: 'Saved the profile'
        //     //     }
        //     //     res.status(200).json(data).end()
        //     // } else {
        //     //     logger.debug('FILE DID NOT SAVE')
        //     //     const data = {
        //     //         success: false,
        //     //         message: 'File did not save'
        //     //     }
        //     //     return res.status(500).json(data).end()
        //     // }
        // }
    }


}

module.exports = ProfileController