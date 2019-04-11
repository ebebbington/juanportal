const express = require('express');
const app = express();
const port = 3005
const fs = require('fs')
const people = JSON.parse(fs.readFileSync('./people.json'))
const server = app.listen(port, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

// Set the viewing engine
app.set('view engine', 'pug')

// Server static files from the public folder
app.use(express.static(__dirname + '/public'))

// On / render index.pug in views/ as pug expects it to be in views
app.get('/', (req, res) => {
  res.render('index', { // pass in variables to the file
    name: 'Edward',
    title: 'Homepage',
    people: people.profiles
  });
});

app.get('/profile', (req, res) => {
  let id = req.query.id
  id = Number(id)
  let person = []
  for (let i = 0; i < people.profiles.length; i++) {
    if (id === people.profiles[i].id) {
      person.push(people.profiles[ i ])
    }
  }
  res.render('profile', {
    title: `About ${person.name}`,
    person
  })
})

server.on('error', function (error) {
  res.render('error', {
    errorMsg: error
  })
})