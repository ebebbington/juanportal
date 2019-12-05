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
    const count = parseInt(req.params.count)
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

app.route('/profile/id/:id')
.get( async (req, res) => {
  const id = req.params.id
  const Profile = new ProfileModel
  await Profile.findOneById(id)
  console.log(Profile)
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

// app.route('/id/:id')
//   .get(ProfileController.get)
//   .delete(ProfileController.delete)
//   .put(ProfileController.update)

// app.route('/add')
//   .get((req, res) => { res.render('profile/add', {title: 'Add a profile'})})
//   .post(upload.single('image'), ProfileController.post)

module.exports = app