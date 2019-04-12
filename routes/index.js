//
// URL: localhost:3005/
//

const express = require('express')
const app = express()
const fs = require('fs')
const people = JSON.parse(fs.readFileSync('/mnt/c/xampp/htdocs/juanportal/people.json'))
const morgan = require('morgan')

app.use(morgan('tiny'))

// On '/' render index.pug in views/ as pug expects it to be in views
app.get('/', (req, res) => {
  res.render('index', { // pass in variables to the file
    name: 'Edward',
    title: 'Homepage',
    people: people.profiles
  });
});

module.exports = app