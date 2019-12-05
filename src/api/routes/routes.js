const express = require('express')
const router = express.Router()
const app = express()
const ProfileController = require('../controllers/ProfileController.js')
const ProfileModel = require('../models/ProfileModel')

// For when an image is submited in the form when POSTing a profile
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

/**
 * /api/profile/count/:count
 */
app.route('/profile/count/:count')
  .get((req, res) => {
    const count = req.params.count
    const Profile = new ProfileModel
    Profile.findManyByCount(count)
    .then((profiles) => {
      return res.status(200).json({success: true, message: 'Grabbed profiles', data: profiles})
    })
    .catch((err) => {
      return res.status(500).json({success: false, message: 'An error occured'}).end()
    })
    console.log(req.params.count)
  })

// app.route('/id/:id')
//   .get(ProfileController.get)
//   .delete(ProfileController.delete)
//   .put(ProfileController.update)

// app.route('/add')
//   .get((req, res) => { res.render('profile/add', {title: 'Add a profile'})})
//   .post(upload.single('image'), ProfileController.post)

module.exports = app