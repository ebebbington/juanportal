const app = require('express')()
const ProfileModel = Object(require('./../models/profile'))
const logger = Object(require('../helpers/logger'))

// On '/' render index.pug in views/ as pug expects it to be in views
app.get('/', (req, res) => {
  logger.info(`Request URL ${req.originalUrl} handled by GET /`)
  ProfileModel.find({}).sort({'date': -1}).limit(10).exec(function (err, profiles) {
    logger.info('Returning profiles to the index page if any')
    return res.render('index.pug', { // pass in variables to the file
      title: 'Homepage',
      people: profiles || []
    })
  })
})

module.exports = app