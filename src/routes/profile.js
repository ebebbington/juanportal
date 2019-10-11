//
// URL: localhost:3005/profile
//
const app = require('express')()
const Profile = Object(require('./../models/profile'))
const bodyParser = require('body-parser')
const fs = require('fs')
const logger = Object(require('.././logger'))
const config = Object(require('.././juanportal'))
const _ = require('lodash')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

function generateImagePathWithRandomisedName (imgName) {
  const arr = imgName.split('.')
  const ext = _.last(arr)
  const name = config.images.rootPath
    + Math.random().toString(36).substring(2, 15)
    + Math.random().toString(36).substring(2, 15)
    + '.' + ext
    return name
}

function saveImageToFileSystem (image, imagePath) {
  if (image) {
    fs.writeFile(imagePath, image.buffer, 'base64', function (err) {
      if (err) {
        logger.error(err.message)
        res.status(500).send({error: 'Problem saving the supplied image'})
        return
      }
    })
  }
  if (!image) {
    // create a copy of the file
    const sampleImgPath = String(config.images.sampleImgPath)
    const sampleImg = fs.createReadStream(sampleImgPath)
    const newImg = fs.createWriteStream(imagePath)
    sampleImg.pipe(newImg)
  }
}

function getObjectIdFromQuery (id) {
  try {
    const ObjectId = require('mongoose').Types.ObjectId
    return new ObjectId(id)
  } catch (e) {
    return false
  }
}

// View of Single Profile
app.get('/', (req, res) => {
  const id = getObjectIdFromQuery(req.query.id)
  Profile.findOne({ _id: id }, function (err, profile) {
    if (err) {
      logger.error(err)
      return res.status(500).send({error: 'Problem fetching profiles'})
    }
    // Check if data was pulled
    if (!profile) {
      logger.info(`No profile matched ${id}`)
      return res.status(404).send({error: 'No profiles were found'})
    }
    if (profile) {
      logger.info('Profile was found')
      // return data
      return res.render('profile/view', {
        title: `About ${profile.name}`,
        name: profile.name,
        description: profile.description,
        image: profile.image
      })
    }
  })
})

// On selecting to create a new profile
app.get('/add', (req, res) => { // /profile/add
  res.render('profile/add', {
    title: 'Add a profile'
  })
})

/**
 * POST /profile/add
 */
app.post('/add', upload.single('image'), function (req, res) {
  // Default the image name incase one isn't supplied
  let imgName = config.images.sampleImgName
  let imgFile = false
  // Redefine image vars if image is supplied
  if (req.file) {
    imgName = req.file.originalname
    imgFile = req.file
  }
  // Generate the image name and path
  const imgPath = generateImagePathWithRandomisedName(imgName)
  // Set up the profile
  const newProfile = new Profile({
    name: req.body.name,
    description: req.body.description,
    image: imgPath
  })
  // Validate
  const validationErrors = newProfile.validateSync()
  if (validationErrors) {
    logger.error(validationErrors)
    return res.status(500).send({errors: 'An error occured when saving. Please try again'})
  }
  // save profile and image
  try {
    newProfile.save()
    saveImageToFileSystem(imgFile, imgPath)
    logger.info('Saved profile and image')
    return res.redirect('/')
  } catch (err) {
    logger.error(err)
    return res.status(500).send({errors: 'Problem saving'})
  }
})

app.get('/delete', (req, res) => {
  const id = getObjectIdFromQuery(req.query.id)
  // First get the image path from the user
  Profile.findOne({_id: id}, function (err, profile) {
    if (err) {
      logger.error(err)
      return res.status(500).send({ errors: 'Problem deleting that profile' })
    }
    const pathOfImageToDelete = profile.image
    // Remove the image from the FS
    try {
      fs.unlinkSync(pathOfImageToDelete)
    } catch (err) {
      // but disregard
      logger.error(err)
    }
    // then delete profile
    Profile.deleteOne({ _id: id }, function (err) {
      if (err) {
        logger.error(err)
        return res.status(500).send({ errors: 'Problem deleting that profile' })
      }
      return res.redirect('/')
    })
  })
})

module.exports = app