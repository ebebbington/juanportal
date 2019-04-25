const mongoose = require('mongoose')

//
// Profile Schema - Define the data we want access to
//
const profileSchema = new mongoose.Schema({
  'name': String,
  'description': String,
  'image': String
})
//
// Define the model (Document)
//
const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile