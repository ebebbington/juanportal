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

// ///////////////////////////////
// Configurations
// ///////////////////////////////
app.set('view engine', 'pug') // view engine
app.use(express.static(__dirname + '/public')) // server from public
app.use('/profile', profile) // routes
app.use('/', index)


// ////////////////////////////////
// Error/Connection Handlers
// ////////////////////////////////
app.on('error', function (req, res) { // server
  res.render('error', {
    errorMsg: req
  })
})
db.on('error', console.error.bind( // on mongoose error
  console, 'connection error'
))
db.once('open', function () { // on connect
  console.log('db connected')
})
db.once('close', function () { // on close
  console.log('db closed')
})
db.once('disconnect', function () { // on disconnect
  console.log('db disconnected')
})
process.on('SIGINT', function () { // on node process ending
  mongoose.disconnect()
  console.log('db disconnected due to node process ending')
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