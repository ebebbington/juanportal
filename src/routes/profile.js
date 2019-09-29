//
// URL: localhost:3005/profile
//
const app = require('express')()
const morgan = require('morgan')
const mongoose = require('mongoose')
const dbUrl = require('.././juanportal').dbUrl
const Profile = require('./../models/profile')
const bodyParser = require('body-parser')
const fs = require('fs')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const { validationResult, body } = require('express-validator')

app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

function generateImageName (imgExt) {
  const imgPath = './images/'
    + Math.random().toString(36).substring(2, 15)
    + Math.random().toString(36).substring(2, 15)
    + '.' + imgExt
    return imgPath
}

function saveProfile (name, description, image, imgPath, res) {
  // create the document
  mongoose.connect(dbUrl, { useNewUrlParser: true })
  const newProfile = new Profile({
    name: name,
    description: description,
    image: imgPath
  })
  // validation
  newProfile.validate(function (err) {
    if (err) {
      return res.status(500).send({error: 'Problem validating your new profile'})
    }
  })
  // save image if one
  if (image) {
    fs.writeFile(imgPath, image.buffer, 'base64', function (err) {
      if (err) {
        return res.status(500).send({error: 'Problem saving the supplied image'})
      }
    })
  }
  // save to mongoose
  newProfile.save(function (err) {
    if (err) {
      return res.status(500).send({error: 'Problem saving this to the database'})
    }
  })
}

// On '/profiles' render profiles page getting the ID sent across
//
// View of Single Profile
app.get('/', (req, res) => {
  const ObjectId = require('mongoose').Types.ObjectId
  const id = new ObjectId(req.query.id)
  mongoose.connect(dbUrl, { useNewUrlParser: true})
  Profile.findOne({ _id: id }, function (err, profile) {
    // If error
    if (err) {
      return res.status(500).send({error: 'Problem fetching profiles'})
    }
    // Check if data was pulled
    if (!profile) {
      return res.status(404).send({error: 'No profiles were found'})
    } else {
      res.render('profile', {
        title: `About ${profile.name}`,
        name: profile.name,
        description: profile.description,
        image: profile.image
      })
    }
    mongoose.disconnect()
  })
})

// On selecting to create a new profile
app.get('/add', (req, res) => {
  res.render('add', {
    title: 'Add a profile'
  })
})

// On submititng the new profile
app.post('/add', upload.single('image'), [
  // Sanitisation
  body('name')
    .not().isEmpty()
    .trim(),
  body('description')
    .not().isEmpty()
    .trim(),
], function (req, res) {
  // Check for errors in sanitisation
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  // get data
  const name = String(req.body.name)
  const description = String(req.body.description)
  console.log(name, description)
  return false
  const image = req.file
  console.log(image)
  if (!image) {
    const imageName = './images/sample.jpg'
    saveProfile(name, description, null, imageName, res)
    return res.redirect('/')
  } 
  // check the extension of the image name
  const imgExt = image.originalname.split('.').pop()
  const acceptedImageExtensions = ['png', 'jpg', 'jpeg']
  if (acceptedImageExtensions.indexOf(imgExt) < 0) {
    return res.render('add', {
      title: 'Add title',
      imageErr: 'Wrong format'
    })
  }
  // generate the unique name for the image
  const imgPath = generateImageName(imgExt)
  // save he new profile
  saveProfile(name, description, image, imgPath, res)
  return res.redirect('/')
})

app.get('/delete', (req, res) => {
  const ObjectId = mongoose.Types.ObjectId
  try {
    const id = new ObjectId(req.query.id)
    mongoose.connect(dbUrl, { useNewUrlParser: true })
    Profile.deleteOne({ _id: id }, function (err) {
      if (err) {
        mongoose.disconnect()
        return res.status(500).send({ errors: 'Problem deleting that profile' })
      } else {
        mongoose.disconnect()
      return res.redirect('/')
      }
    })
  } catch (e) {
    return res.status(400).send({error: 'You trying to delete a random profile?'})
  }
})

module.exports = app