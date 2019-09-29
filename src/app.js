// ///////////////////////////////
// Packages
// ///////////////////////////////
const express = require('express');
const app = express();

// ///////////////////////////////
// Server Set Up
// ///////////////////////////////
const port = require('./juanportal').nodePort
const server = app.listen(port, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

// ///////////////////////////////
// Define the routes
// ///////////////////////////////
const profile = require('./routes/profile.js')
const index = require('./routes/index.js')
const databaseLogger = require('./models/database-logger.js')
app.use('/profile', profile)
app.use('/', index)
app.use('*', databaseLogger)

// ///////////////////////////////
// Configurations
// ///////////////////////////////
app.set('view engine', 'pug') // view engine
app.set('views', __dirname + '/views') // set dir to look for views
app.use(express.static(__dirname + '/public')) // serve from public