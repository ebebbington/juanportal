const express = require('express')
const router = express.Router()
const app = express()
const ProfileController = require('../controllers/ProfileController.js')
const ProfileModel = require('../models/ProfileModel')
const logger = require('../helpers/logger')

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
    const Profile = new ProfileModel
    const profiles = await Profile.findManyByCount(count)
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
    await Profile.findOneById(id)
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
  .post(upload.single('image'), (req, res) => {

  })

// app.route('/id/:id')
//   .get(ProfileController.get)
//   .delete(ProfileController.delete)
//   .put(ProfileController.update)

// app.route('/add')
//   .get((req, res) => { res.render('profile/add', {title: 'Add a profile'})})
//   .post(upload.single('image'), ProfileController.post)

module.exports = app