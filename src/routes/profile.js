const express = require('express')
const router = express.Router()
const ProfileController = require('../controllers/ProfileController.js')

// For when an image is submited in the form when POSTing a profile
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router
  /**
  * GET /profile?id
  */
  .get("/", ProfileController.get)
  /**
   * GET /profile/add
   */
  .get('/add', ((req, res) => { res.render('profile/add', {title: 'Add a profile'})}))
  /**
   * POST /profile/add
   */
  .post('/add', upload.single('image'), ProfileController.post)
  /**
   * GET /profile/delete?id
   */
  .get('/delete', ProfileController.delete)

module.exports = router