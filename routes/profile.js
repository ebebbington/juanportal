//
// URL: localhost:3005/profile
//
const app = require('express')()
const Profile = require('./../models/profile')
const morgan = require('morgan')
const mongoose = require('mongoose')
const dbUrl = require('./../config/db').url

app.use(morgan('tiny'))

// On '/profiles' render profiles page getting the ID sent across
app.get('/', (req, res) => {
  let id = Number(req.query.id)
  mongoose.connect(dbUrl, { useNewUrlParser: true})
  Profile.findOne({ id: id }, function (err, profile) {
    console.log(profile)
    // If error
    if (err) res.end('Error:', err)
    // Check if data was pulled
    if (!profile) {
      res.end('No id was found')
    } else {
      res.render('profile', {
        title: `About ${profile.name}`,
        name: profile.name,
        description: profile.description
      })
    }
    mongoose.disconnect()
  })

  /* Old way
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
  } */
})

module.exports = app