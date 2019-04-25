const app = require('express')()
const morgan = require('morgan')
const mongoose = require('mongoose')
const dbUrl = require('./../config/db').url
const Profile = require('./../models/profile')
const bodyParser = require('body-parser')
const fs = require('fs')

const title = 'Add a Profile'

app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('add-profile', {
    title: title
  })
})

app.post('/', (req, res) => {
  // get data
  const name = String(req.body.name)
  const description = String(req.body.description)
  let imageUrl = ''
  if (req.body.image) {
    imageUrl = String(req.body.image)
  } else {
    imageUrl = 'http://localhost/copytube/images/sample.jpg' // todo :: hard coded section, some reason this code always runs
  }
  // check imageUrl extension
  const acceptedImageExtensions = ['.png', '.jpg']
  const imageExtension = imageUrl.substr(imageUrl.length - 4).toLowerCase()
  if (acceptedImageExtensions.indexOf(imageExtension) === -1) {
    res.render('add-profile', {
      title: title,
      imageErr: 'Wrong format'
    })
    return
  }
  // check data is set
  if (!name) {
    res.render('add-profile', {
      title: 'Add a Profile', nameErr: 'Name is not set'
    })
    return
  }
  if (!description) {
    res.render('add-profile',
      {title: 'Add a Profile', descriptionErr: 'Description is not set'
      })
    return
  }
  // escape/encode data todo

  mongoose.connect(dbUrl, { useNewUrlParser: true })
  const newProfile = new Profile({ name: name, description: description, image: imageUrl })
  newProfile.save(function (err, prof) {
    if (err) return console.error(err)
  })
  mongoose.disconnect()
  res.redirect('/')
})

module.exports = app