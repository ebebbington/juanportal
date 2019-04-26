// ///////////////////////////////
// Global Variables/Requires
// ///////////////////////////////
const express = require('express');
const app = express();
const port = 3005
const server = app.listen(port, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
const profile = require('./routes/profile.js')
const index = require('./routes/index.js')
const mongoose = require('mongoose')
const db = mongoose.connection
const addProfile = require('./routes/add-profile.js')
const databaseConnHandler = require('./models/database-handler.js')
const deleteProfile = require('./routes/delete-profile.js')

// ///////////////////////////////
// Configurations
// ///////////////////////////////
app.set('view engine', 'pug') // view engine
app.set('views', 'http://localhost/juanportal/views')
app.use(express.static(__dirname + '/public')) // serve from public
app.use('/profile', profile) // routes
app.use('/', index)
app.use('/add-profile', addProfile)
app.use('/delete-profile', deleteProfile)
app.use('*', databaseConnHandler)

// ////////////////////////////////
// Error Handler
// ////////////////////////////////
app.on('error', function (req, res) { // server
  res.render('error', {
    errorMsg: req
  })
})

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