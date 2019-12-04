const express = require('express')
const router = express.Router()
const app = express()
const ProfileController = require('../controllers/ProfileController.js')

// For when an image is submited in the form when POSTing a profile
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.route('/id/:id')
  .get(ProfileController.get)
  .delete(ProfileController.delete)
  .put(ProfileController.update)

app.route('/add')
  .get((req, res) => { res.render('profile/add', {title: 'Add a profile'})})
  .post(upload.single('image'), ProfileController.post)

module.exports = app