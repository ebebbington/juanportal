const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    'name': {
      type: String,
      required: [true, 'Name has not been supplied'],
      minlength: [2, 'Name is too short and should be at least 2 characters in length'],
      maxlength: [140, 'Name is too long and should not exceed 140 characters'],
      validate: {
        validator: function (v: string) {
          return /.+[^\s]/.test(v)
        },
        message: (props: { value: any; }) => `${props.value} is not set`
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
      lowerCase: true,
      validate: {
        validator: function (v: string) {
          return /\.(jpg|jpeg|JPG|JPEG|png|PNG)$/.test(v)
        },
        message: (props: { value: any; }) => 'Image does not have a valid extension. Please use: .jpg, .jpeg or .png'
      },
      minlength: [5, 'Image name is to small, therefore not a valid name'] //eg z.png
    }
  }, {timestamps: true})

module.exports = mongoose.model('Profile', ProfileSchema)