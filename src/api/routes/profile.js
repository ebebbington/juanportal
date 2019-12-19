const express = require('express')
const app = express()
const ProfileController = require('../controllers/ProfileController')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.route('/count/:count')
  .get(ProfileController.GetProfilesByAmount)

app.route('/id/:id')
  .get(ProfileController.GetProfileById)
  .delete(ProfileController.DeleteProfileById)

app.route('/')
  .post(upload.single('image'), ProfileController.PostProfile)

module.exports = app