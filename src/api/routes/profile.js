const express = require('express')
const app = express()
const ProfileController = require('../controllers/ProfileController')

app.route('/count/:count')
  .get(ProfileController.GetProfilesByAmount)

app.route('/id/:id')
  .get(ProfileController.GetProfileById)
  .delete(ProfileController.DeleteProfileById)

app.route('/')
  .post(ProfileController.PostProfile)

module.exports = app