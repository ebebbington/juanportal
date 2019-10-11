// ///////////////////////////////
// Packages
// ///////////////////////////////
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const morgan = require('morgan')

// ///////////////////////////////
// HTTP Logging
// ///////////////////////////////
app.use(morgan('dev', {
  skip: function (req, res) {
      return res.statusCode < 400
  }, stream: process.stderr
}));
app.use(morgan('dev', {
  skip: function (req, res) {
      return res.statusCode >= 400
  }, stream: process.stdout
}));

// ///////////////////////////////
// Server Set Up
// ///////////////////////////////
const logger = Object(require('./logger')) // .debug, .info, error
const nodeEnv = String(require('./juanportal').nodeEnv)
const port = parseInt(require('./juanportal').nodePort)
const server = app.listen(port, () => {
  logger.info(`Server has started on ${port} on ${nodeEnv}`)
})

// ///////////////////////////////
// Database Set Up
// ///////////////////////////////
const dbUrl = String(require('./juanportal').dbUrl)
mongoose.connect(dbUrl, {useNewUrlParser: true})

// ///////////////////////////////
// Define the routes
// ///////////////////////////////
const profile = require('./routes/profile.js')
const index = require('./routes/index.js')
const db = require('./db.js')
app.use('/profile', profile)
app.use('/', index)
app.use('*', db)

// ///////////////////////////////
// Configurations
// ///////////////////////////////
app.set('view engine', 'pug') // view engine
app.set('views', __dirname + '/views') // set dir to look for views
app.use(express.static(__dirname + '/public')) // serve from public