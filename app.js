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

// ///////////////////////////////
// Configurations
// ///////////////////////////////
// Set the viewing engine
app.set('view engine', 'pug')
// Serve static files from the public folder
app.use(express.static(__dirname + '/public'))


// On '/' render index.pug in views/ as pug expects it to be in views
app.get('/', (req, res) => {
  res.render('index', { // pass in variables to the file
    name: 'Edward',
    title: 'Homepage',
    people: people.profiles
  });
});
// On '/profiles' render profiles page getting the ID sent across
app.get('/profile', (req, res) => {
  let id = Number(req.query.id)
  let person = []
  for (let i = 0; i < people.profiles.length; i++) {
    if (id === people.profiles[i].id) {
      person.push(people.profiles[ i ])
    }
  }
  if (person.length > 0) {
    res.render('profile', {
      title: `About ${person[0].name}`,
      person
    })
  } else {
    res.send('No ID has been found')
  }
})

// ////////////////////////////////////
// Error handler
// ////////////////////////////////////
server.on('error', function (error) {
  res.render('error', {
    errorMsg: error
  })
})