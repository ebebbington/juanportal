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
// ///////////////////////////////

// ///////////////////////////////
// Configurations
// ///////////////////////////////
// Set the viewing engine
app.set('view engine', 'pug')
// Serve static files from the public folder
app.use(express.static(__dirname + '/public'))
// Routes
app.use('/profile', profile)
app.use('/', index)
// ////////////////////////////////

// ////////////////////////////////
// Error handler
// ////////////////////////////////
server.on('error', function (error) {
  res.render('error', {
    errorMsg: error
  })
})
// ////////////////////////////////