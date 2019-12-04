const express = require('express')
const router = express.Router()
const ProfileModel = require('./../models/ProfileModel')

// On '/' render index.pug in views/ as pug expects it to be in views
router
  .get('/', (req, res) => {
    const Profile = new ProfileModel()
    Profile.findTen().then((profiles) => {
      console.log(profiles)
      return res.render('index.pug', { // pass in variables to the file
        title: 'Homepage',
        people: profiles || []
      })
    })
})

module.exports = router