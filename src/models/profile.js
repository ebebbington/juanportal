const mongoose = require('mongoose')

//
// Profile Schema - Define the data we want access to
//
const profileSchema = new mongoose.Schema({
  'name': {
    type: String,
    required: [true, 'Name has not been supplied'],
    minlength: [2, 'Name is too short and should be at least 2 characters in length'],
    maxlength: [140, 'Name is too long and should not exceed 140 characters'],
    validate: {
      validator: function (v) {
        return /.+[^\s]/.test(v)
      },
      message: props => `${props.value} is not set`
    }
  },
  'description': {
    type: String,
    required: false,
    maxlength: [400, 'Description is too long and should not exceed 400 characters']
  },
  'image': {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\.(gif|jpg|jpeg|tiff|png)$/.test(v)
      },
      message: props => `${props.value} is not a valid image extension`
    },
    minlength: [5, 'Image name is to small, therefore not a valid name'] //eg z.png
  }
})
//
// Define the model (Document)
//
const ProfileModel = mongoose.model('Profile', profileSchema)

module.exports = ProfileModel