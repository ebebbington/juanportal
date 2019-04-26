const app = require('express')()
const Profile = require('./../models/profile')
const morgan = require('morgan')
const mongoose = require('mongoose')
const dbUrl = require('./../config/db').url
const bodyParser = require('body-parser')

app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

// On '/profiles' render profiles page getting the ID sent across
app.get('/', (req, res) => {
  console.log('hey up')
  const ObjectId = mongoose.Types.ObjectId
  const id = new ObjectId(req.query.id)
  console.log(id)
  mongoose.connect(dbUrl, { useNewUrlParser: true })
  Profile.deleteOne({ _id: id }, function (err) {
    if (err) console.error(err)
    console.log('deleted a single record')
  })
  mongoose.disconnect()
  // redirect
  res.redirect('/')
})

module.exports = app