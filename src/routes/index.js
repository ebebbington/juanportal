const express = require('express')
const router = express.Router()
const ProfileModel = require('./../models/ProfileModel')

// On '/' render index.pug in views/ as pug expects it to be in views
router
  /**
  * /
  */
  .get('/', (req, res) => {
    ProfileModel.findTen().then((profiles) => {
      return res.render('index.pug', { // pass in variables to the file
        title: 'Homepage',
        people: profiles || []
      })
    })
})

module.exports = router