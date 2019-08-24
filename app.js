// ///////////////////////////////
// Packages
// ///////////////////////////////
const express = require('express');
const app = express();

// ///////////////////////////////
// Server Set Up
// ///////////////////////////////
const config = require('./config/juanportal-config.js')
const port = config.nodePort
const server = app.listen(port, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

// ///////////////////////////////
// Routes
// ///////////////////////////////
const profile = require('./routes/profile.js')
const index = require('./routes/index.js')
const databaseConnHandler = require('./models/database-handler.js')
app.use('/profile', profile) // routes
app.use('/', index)
app.use('*', databaseConnHandler)

// ///////////////////////////////
// Configurations
// ///////////////////////////////
app.set('view engine', 'pug') // view engine
app.set('views', __dirname + '/views') // set dir to look for views
app.use(express.static(__dirname + '/public')) // serve from public

// ////////////////////////////////
// Error Handler
// ////////////////////////////////
app.on('error', function (req, res) { // server
  console.error(`ERROR: ${req}`)
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
