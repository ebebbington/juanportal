const Profile = require('../models/profile.js')
const mongoose = require('mongoose')
const logger = require('../helpers/logger.js')
const _ = require('lodash')
const fs = require('fs')
const util = require('util')

class ProfileController {

  /** Get the extension from a file name
   * 
   * @param {String} fileName Full original name of the file
   * @returns {String/Bool} The extension if found, else false
   */
  static getFileExtension (fileName = '') {
    if (!fileName) {
      return false
    }
    const extArr = fileName.split('.')
    const ext = _.last(extArr)
    return ext ? '.' + ext : false
  }

  /**
   * Generate a random 36 character string
   * 
   * @returns {String} A 36 character randomised string
   */
  static generateRandomString () {
    return Math.random().toString(36).substring(2, 8)
    + Math.random().toString(36).substring(2, 8)
    + Math.random().toString(36).substring(2, 8)
    + Math.random().toString(36).substring(2, 8)
    + Math.random().toString(36).substring(2, 8)
    + Math.random().toString(36).substring(2, 8)
  }

  /** Save an image file
   * 
   * @param {Object} image The image file from req.file
   * @param {String} pathAndName Full path and randomised name to save the file
   * @param {Object} res Response object
   */
  static saveImageToFileSystem (image = {}, pathAndName = '', res = {}) {
    if (image) {
      logger.debug(`Saving the image ${pathAndName} to the file system`)
      fs.createWriteStream(pathAndName).write(image.buffer)
    }
    if (!image) {
      logger.debug(`Copying the sample image file to be saved as ${pathAndName}`)
      // create a copy of the file
      const pathToSampleImage = '/var/www/juanportal/public/images/sample.jpg'
      fs.copyFile(pathToSampleImage, pathAndName, (err) => {
        if (err) {
          logger.error(err.message)
          return res.status(500).send({error: 'problem saving he supplied image'})
        }
      })
    }
  }

  /**
   * Get a single profile matching an id
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  static getOneById (req, res, next) {
    try {
      const id = new mongoose.Types.ObjectId(req.query.id)
      Profile.findOne({ _id: id }, function (err, profile) {
          if (err) {
            logger.error(`Problem finding a profile: ${err.message}`)
            res.status(500)
            return res.render('error', {title: 500})
          }
          // Check if data was pulled
          if (!profile) {
            logger.info(`No profile matched ${id}`)
            res.status(404)
            return res.render('error', {title: 404})
          }
          if (profile) {
            logger.info('Profile was found')
            // return data
            const data = {
              title: `About ${profile.name}`,
              name: profile.name,
              description: profile.description,
              image: profile.image
            }
            return res.render('profile/view', data)
          }
        })
    } catch (err) {
        logger.error(`Request errored: ${err.message}`)
        res.status(500)
        return res.render('error', {title: 500})
    }    
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  static add (req, res, next) {
    // Default the image name in case one isn't supplied
    const randomString = ProfileController.generateRandomString()
    const image = {
      name: req.file ? req.file.originalname : 'sample.jpg',
      file: req.file ? req.file : false,
      hasSuppliedImage: req.file ? true : false,
      databasePath: function () {
        if (req.file) {
          return '/public/images/' + randomString + ProfileController.getFileExtension(req.file.originalname)
        }
        // will point to a copy of the sample image later so just add the same extension
        return '/public/images/' + randomString + '.jpg'
      },
      fileSystemPath: function () {
        if (req.file) {
          return '/var/www/juanportal/public/images/' + randomString + ProfileController.getFileExtension(req.file.originalname)
        }
        // will point to a copy of the sample image later so just add the same extension
        return '/var/www/juanportal/public/images/' + randomString + '.jpg'
      }
    }
    logger.debug(util.inspect(image, false, null, true))
    // Set up the profile
    const newProfile = new Profile({
        name: req.body.name,
        description: req.body.description,
        image: image.databasePath()
    })
    logger.debug(util.inspect(newProfile, false, null, true))
    // Validate
    const validationErrors = newProfile.validateSync()
    if (validationErrors) {
        logger.error(validationErrors)
        return res.status(500).send({errors: 'An error occured when saving. Please try again'})
    }
    // save profile and image
    try { 
        newProfile.save()
        logger.debug('Saved the profile')
        ProfileController.saveImageToFileSystem(image.file, image.fileSystemPath(), res)
        logger.info('Saved image')
        return res.redirect('/')
    } catch (err) {
        logger.error(err)
        return res.status(500).send({errors: 'Problem saving'})
    }
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  static delete (req, res, next) {
    try {
      const id = new mongoose.Types.ObjectId(req.query.id)
      Profile.findOne({_id: id}, function (err, profile) {
        if (err) {
          logger.error(err)
          return res.status(500).send({ errors: 'Problem deleting that profile' })
        }
        const pathOfImageToDelete = '/var/www/juanportal' +  profile.image
        logger.debug(`Going to delete the image ${pathOfImageToDelete}`)
        // Remove the image from the FS
        try {
          fs.unlinkSync(pathOfImageToDelete)
        } catch (err) {
          // but disregard
          logger.error(err)
        }
        // then delete profile
        Profile.deleteOne({ _id: id }, function (err) {
          if (err) {
            logger.error(err)
            return res.status(500).send({ errors: 'Problem deleting that profile' })
          }
          return res.redirect('/')
        })
      })
    } catch (err) {
      logger.error(err.message)
      return res.status(500).send({err: 'frjrfvjvrv'})
    }
  }
}

module.exports = ProfileController