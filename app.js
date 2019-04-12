// ///////////////////////////////
// Global Variables/Requires
// ///////////////////////////////
const express = require('express');
const app = express();
const port = 3005
const fs = require('fs')
const people = JSON.parse(fs.readFileSync('./people.json'))
const server = app.listen(port, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
const profile = require('./routes/profile.js')
const index = require('./routes/index.js')
const mongoose = require('mongoose')
const morgan = require('morgan')
// ///////////////////////////////

// ///////////////////////////////
// Configurations
// ///////////////////////////////
// Set the viewing engine
app.set('view engine', 'pug')
// Serve static files from the public folder
app.use(express.static(__dirname + '/public'))
// Create routes
app.use('/profile', profile)
app.use('/', index)
app.use(morgan('tiny'))
// ////////////////////////////////

// ////////////////////////////////
// Error handler
// ////////////////////////////////
app.on('error', function (req, res) {
  res.render('error', {
    errorMsg: req
  })
})
// ////////////////////////////////

// ////////////////////////////////
// Testing Purposes Only
// ////////////////////////////////
/* mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', function () {
  console.log('db connected')
})
const peopleSchema = new mongoose.Schema({
  name: String,
  description: String
})
const Persons = mongoose.model('Profile', peopleSchema)
const edward = new Persons({
  name: 'Adam Jeffrey',
  description: 'Adam is a Lead Developer at Intercity Technology. Another note is he is shocking at table football. He is nicknames Adamantium.'
})
edward.save(function (a, b) {
  console.log('saved')
}) */
// ////////////////////////////////