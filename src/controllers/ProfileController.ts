import { promises } from "dns"

const ProfileModel = require('../models/ProfileModel.js')
const logger = require('../helpers/logger.js')
const _ = require('lodash')
const fs = require('fs')
const util = require('util')
const ImageHelper = require('../helpers/image')


class ProfileController {

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
    /**
     * const Profile = new Profile;
     * const newProfile = Profile.create()
     * const validationErrors = Profile.validateInsertFields
     * if (!validationErrors) {
     *  const saved = Profile.save(newProfile)
     * }
     */
    // const Profile = new ProfileModel
    // const dummyDatabaseData = {
    //   name: 'Edward',
    //   description: 'Edward is 21 years old',
    //   iShouldntExist: 'i should be here'
    // }
    // Profile.fill(dummyDatabaseData)
    // logger.debug(util.inspect(Profile))
    // return false
    const Image = new ImageHelper;
    // generate a new file name regardless if one was passed
    let imageFileName: string = 'sample.jpg'
    if (req.file) {
      imageFileName =  req.file.originalname
    }
    imageFileName = Image.createNewFilename(imageFileName)
    const Profile = new ProfileModel
    const newProfile = Profile.create({
      name: req.body.name, 
      description: req.body.description, 
      image: '/public/images/' + imageFileName
    })
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
    const Profile = new ProfileModel
    Profile.findOneById(req.query.id)
      .then((profile: any) => {
        Profile.deleteOneById(profile._id)
          .then ((result: boolean) => {
            const Image = new ImageHelper
            const exists = Image.deleteFromFS(profile.image)
            logger.debug('exists: ' + exists)
            res.redirect('/')
        })
      })
  }
}

module.exports = ProfileController