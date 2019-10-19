const app = require('express')()
const ProfileModel = require('./../models/ProfileModel')
const logger = Object(require('../helpers/logger'))

// On '/' render index.pug in views/ as pug expects it to be in views
app.get('/', (req, res) => {
  ProfileModel.findTen().then((profiles) => {
    logger.debug('Just completed the promise')
    return res.render('index.pug', { // pass in variables to the file
      title: 'Homepage',
      people: profiles || []      
    })
  })
})

module.exports = app