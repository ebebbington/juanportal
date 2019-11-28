const ProfileModel = require('../models/ProfileModel.js')
const logger = require('../helpers/logger.js')
const _ = require('lodash')
const fs = require('fs')
const util = require('util')
const ImageHelper = require('../helpers/image')


class ProfileController {

  /** Get the extension from a file name
   * 
   * @param {String} fileName Full original name of the file
   * @returns {String} The extension if found, else an empty string
   */
  private static getFileExtension (fileName: string = ''): string {
    if (!fileName) {
      return ''
    }
    const extArr = fileName.split('.')
    const ext = _.last(extArr)
    return ext ? '.' + ext : ''
  }

  /**
   * Generate a random 36 character string
   * 
   * @returns {String} A 36 character randomised string
   */
  private static generateRandomString (): string {
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
   * @return {void}
   */
  private static saveImageToFileSystem (image: any = {}, pathAndName: string = '', res: any) {
    if (image) {
      logger.debug(`Saving the image ${pathAndName} to the file system`)
      fs.createWriteStream(pathAndName).write(image.buffer)
    }
    if (!image) {
      logger.debug(`Copying the sample image file to be saved as ${pathAndName}`)
      // create a copy of the file
      const pathToSampleImage: string = '/var/www/juanportal/public/images/sample.jpg'
      fs.copyFile(pathToSampleImage, pathAndName, (err: any) => {
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
  public static deleteImageFromFileSystem (imagePath = ''): void {
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
   *
   * @param {*} req 
   * @param {*} res 
   * @param {*} next
   * @return response
   */
  public static get (req: any, res: any, next: any) {
    const Profile = new ProfileModel
    Profile.findOneById(req.query.id).then((profile: any) => {
      if (!profile) {
        logger.error('couldnt find a single profile')
        res.status(404)
        return res.render('error', {title: 404})
      }
      if (profile) {
        // return data
        const data: object = {
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
   * @return response
   */
  public static post (req: any, res: any) {
    const Image = new ImageHelper;
    // generate a new file name regardless if one was passed
    let imageFileName: string = 'sample.jpg'
    if (req.file) {
      imageFileName =  req.file.originalname
    }
    imageFileName = Image.createNewFilename(imageFileName)
    const Profile = new ProfileModel({
      name: req.body.name, 
      description: req.body.description, 
      image: '/public/images/' + imageFileName
    })
    logger.debug(Profile)
    const newProfile = Profile.create()
    logger.debug(newProfile)
    // save profile and image
    const validationErrors = Profile.validateInputFields(newProfile)
    if (validationErrors) {
      logger.error(validationErrors)
      return res.status(400).send({error: validationErrors})
    }
    const saved = Profile.insertOne(newProfile)
    if (!saved) {
      logger.err('didnt save a profile')
      return res.status(500).send({error: 'idk'})
    }
    if (saved) {
      logger.debug('User saved to database, saving to file system')
      const filesaved = Image.saveToFS(imageFileName, req.file)
      logger.debug(['status of filesaved', filesaved])
      if (filesaved === true) {
        logger.debug('FILE DIDSAVE')
          res.redirect('/')
      } else {
        logger.debug('FILE DID NOT SAVE')
          return res.status(500).send({error: 'problem saving he supplied image'})
      }
    }
  }

  /** Delete a profile
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  static delete (req: any, res: any, next: any) {
    ProfileModel.findOneById(req.query.id).then((profile: any) => {
      if (!profile) {
        logger.error('couldnt find a profile to delete')
        res.status(403)
        return res.render('error', {title: 403})
      }
      if (profile) {
        const id: number = profile._id
        // delete image
        ProfileController.deleteImageFromFileSystem(profile.image)
        // delete profile
        ProfileModel.deleteOneById(id).then((success: any) => {
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