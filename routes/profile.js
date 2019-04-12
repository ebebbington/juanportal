//
// URL: localhost:3005/profile
//

const express = require('express')
const app = express()
const fs = require('fs')
const people = JSON.parse(fs.readFileSync('/mnt/c/xampp/htdocs/juanportal/people.json'))
const morgan = require('morgan')

app.use(morgan('tiny'))

// On '/profiles' render profiles page getting the ID sent across
app.get('/', (req, res) => {
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

module.exports = app