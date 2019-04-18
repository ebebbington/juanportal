const mongoose = require('mongoose')

//
// Profile Schema - Define the data we want access to
//
const profileSchema = new mongoose.Schema({
  'id': Number,
  'name': String,
  'description': String
})
//
// Define the model (Document)
//
const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile