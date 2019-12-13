const express = require('express')
const router = express.Router()
const app = express()
const ProfileController = require('../controllers/ProfileController.js')
const ProfileModel = require('../models/ProfileModel')
const logger = require('../helpers/logger')
const ImageHelper = require('../helpers/ImageHelper')

// For when an image is submited in the form when POSTing a profile
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

/**
 * /api/profile/count/:count
 */
app.route('/profile/count/:count')
  .get( async (req, res) => {
    const count = parseInt(req.params.count)
    if (count < 1) {
      return res.status(400).json({success: false, message: 'Number of requested profiles did not meet the minimum of 1'}).end()
    }
    const profiles = await ProfileModel.findManyByCount(count)
    logger.debug(profiles)
    if (!profiles) {
      return res.status(404).json({success: false, message: 'No profiles were found'}).end()
    }
    if (profiles) {
      return res.status(200).json({success: true, message: 'Grabbed profiles', data: profiles})
    }
  })

app.route('/profile/id/:id')
  .get( async (req, res) => {
    const id = req.params.id
    const Profile = new ProfileModel
    console.log('going to find the profile')
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
  })
  .delete((req, res) => {
    const id = req.params.id
    console.log(id)
    const Profile = new ProfileModel
    Profile.deleteOneById(id)
    .then((success) => {
      if (success) {
        return res.status(200).json({success: true, message: 'Successfully deleted'}).end()
      }
    })
    .catch((success) => {
      return res.status(500).json({success: false, message: 'Failed to delete'}).end()
    })
  })

app.route('/profile')
  .post(upload.single('image'), async (req, res) => {
    console.info(req.body)
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
    console.log(`exists: ${exists}`)
    if (exists === true) {
        const data = {
            success: false,
            message: 'User already exists'
        }
        return res.status(400).json(data).end()
    }

    // Create data
    const Profile = new ProfileModel
    const errors = await Profile.create({
        name: req.body.name,
        description: req.body.description,
        image: '/public/images/' + imageFileName
    })

    // Check any vlidtion errors
    if (errors) {
        const error = errors.errors

        const props = Object.keys(error)
        const fieldName = props[0]

        const message = error[fieldName].message

        console.log(errors)
        // const message = errors.message || errors.message[0].message

        const data = {
            success: false,
            message: message,
            data: fieldName
        }
        console.log(data)
        return res.status(400).json(data).end()
    }

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
  })

module.exports = app