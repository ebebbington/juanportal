const ProfileModel = require('../models/ProfileModel.js')
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

  /** Delete a profiles image from the file system
   * 
   * @param {*} imageName Image name saved with the profile
   */
  static deleteImageFromFileSystem (imagePath = '') {
    logger.debug('inside the delete image function')
    const projectRoot = process.env.PROJECT_ROOT
    const pathToImage = projectRoot + imagePath // image path is: /public/images/...
    logger.debug(`path to delete image: ${pathToImage}`)
    // delete image
    try {
      fs.unlinkSync(pathToImage)
    } catch (err) {
      // but disregard
      logger.error(err)
    }
  }

  /**
   * Get a single profile matching an id
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  static get (req, res, next) {
    ProfileModel.findOneById(req.query.id).then((profile) => {
      if (!profile) {
        logger.error('couldnt find a single profile')
        res.status(404)
        return res.render('error', {title: 404})
      }
      if (profile) {
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
  }

  /** Post a profile
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  static post (req, res, next) {
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
    const newProfile = ProfileModel.create(
        req.body.name,
        req.body.description,
        image.databasePath()
    )
    logger.debug(util.inspect(newProfile, false, null, true))
    // save profile and image
    const hasSaved = ProfileModel.save(newProfile)
    if (!hasSaved) {
      res.status(500)
      return res.render('error', {title: 500})
    }
    if (hasSaved) {
      ProfileController.saveImageToFileSystem(image.file, image.fileSystemPath(), res)
      logger.info('Saved image')
      return res.redirect('/')
    }
  }

  /** Delete a profile
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  static delete (req, res, next) {
    ProfileModel.findOneById(req.query.id).then((profile) => {
      if (!profile) {
        logger.error('couldnt find a profile to delete')
        res.status(403)
        return res.render('error', {title: 403})
      }
      if (profile) {
        const id = profile._id
        // delete image
        ProfileController.deleteImageFromFileSystem(profile.image)
        // delete profile
        ProfileModel.deleteOneById(id).then((success) => {
          if (!success) {
            res.status(500)
            return res.render('error', {title: 500})
          }
          if (success){
            return res.redirect('/')
          }
        })
      }
    })
  }
}

module.exports = ProfileController