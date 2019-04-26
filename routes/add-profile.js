const app = require('express')()
const morgan = require('morgan')
const mongoose = require('mongoose')
const dbUrl = require('./../config/db').url
const Profile = require('./../models/profile')
const bodyParser = require('body-parser')
const fs = require('fs')
const formidable = require('formidable')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const title = 'Add a Profile'

app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('add-profile', {
    title: title
  })
})

app.post('/', upload.single('image'), function (req, res) {
  /*
  * Can access props of image.
  * Can also access buffer stream with imageFile.buffer or use a foreach on it like:
  * imageFil.buffer.forEach(function (val) { console.log(val) }
  * This way is only acieved by having the emctype attribute in pug. The object
  * holds all file data
   */
  // const imageFile = req.file
  // fs.writeFileSync('./images/base64.png', imageFile.buffer, 'base64', function (err) {
  //   if (err) return console.log(err)
  // })
  /*
  * The below code were my multiple methods of downloading and saving a file
  *
  //
  // Method 1 - Check data packets being sent
  //
  let imageData = ''
  req.on('data', function (chunk) {
    console.log(Buffer.from(req.file.toString()))
    console.log('on data')
    imageData += chunk
  })
  req.on('end', function () {
    fs.writeFile('./images/test2.png', imageData, 'binary', function (err) {
      console.log('on end')
      if (err) throw err
      console.log('file saved')
    })
  })
  return

  //
  // Method 3
  //
  // write file using binary
  const test = Buffer.from(req.body.image, 'binary')
  fs.writeFile('./images/test.png', test, 'binary', function (err) {
    if (err) return console.log(err)
  })
  console.log(test)
  console.log('--------------------')
  //
  // Method 4
  //
  // testing in base64 and using writeFileSync instead of writeFile
  const test1 = Buffer.from(req.body.image, 'base64')
  fs.writeFileSync('./images/test1.png', test1, function (err) {
    if (err) return console.log(err)
  })
  console.log(test)
  console.log('--------------------')

  //
  // Method 5
  //
  const image = req.file
  console.log(image)
  console.log('-----------------------')

  return
  */
  // get data
  const name = String(req.body.name)
  const description = String(req.body.description)
  const image = req.file
  let imageName = ''
  image ? imageName = image.originalname : imageName = 'sample.jpg'
  const imagePath = './images/' + imageName
  // check image extension
  const acceptedImageExtensions = ['.png', '.jpg']
  const imageExtension = imageName.substr(imageName.length - 4).toLowerCase()
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
  // Create the path to the file
  let absoluteImagePath = ''
  if (image) { // path to enw file
    absoluteImagePath = 'http://localhost/juanportal/images/' + imageName
  } else { // path to sampke image is not supplied
    absoluteImagePath = 'http://localhost/juanportal/images/sample.jpg'
  }
  // create the document
  mongoose.connect(dbUrl, { useNewUrlParser: true })
  const newProfile = new Profile({
    name: name,
    description: description,
    image: absoluteImagePath
  })
  // validation
  newProfile.validate(function (err) {
    if (err) return console.log(err)
  })
  // save image if one is supplied
  if (image) {
    fs.writeFile(imagePath, image.buffer, 'base64', function (err) {
      if (err) return console.log(err)
    })
  }
  // save to mongoose
  newProfile.save(function (err) {
    if (err) return console.log(err)
  })
  mongoose.disconnect()
  // redirect
  res.redirect('/')
})

module.exports = app