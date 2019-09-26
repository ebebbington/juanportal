const mongoose = require('mongoose')

//
// Profile Schema - Define the data we want access to
//
const profileSchema = new mongoose.Schema({
  'name': {
    type: String,
    required: true,
    minlength: 1
  },
  'description': {
    type: String,
    required: true,
    minlength: 1
  },
  'image': {
    type: String,
    required: true,
    minlength: 5 //eg z.png
  }
})
//
// Define the model (Document)
//
const ProfileModel = mongoose.model('Profile', profileSchema)

module.exports = ProfileModel