const express = require('express')
const app = express()
const JWT = require('../helpers/JWT')
const Document = require('../schemas/ProfileSchema')
const fs = require('fs')

/**
 * /
 */
app.route('/')
  .post( async (req, res) => {
    // Create the JWT out of the name body data
    console.log(req.body.name)
    const token = JWT.createToken({ name: req.body.name })
    if (!token) {
      return res.status(500).json({success: false, message: 'Tried creating a JWT but it couldnt be set', data: token}).end()
    }
    console.info('Created a token on POST /profile: ' + token)
    return res.status(200).json({success: true, message: 'Created a token', data: token}).end()
  })
  .delete(JWT.checkToken, () => {
    console.log('Token checks out!:)')
  })

  .get(async (req, res, next) => {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var schema = new Schema({
      img: { data: Buffer, fileName: String, contentType: String },
      fileName: String
    });
    var A = mongoose.model('A', schema);

    const result = await A.findOne({})

    // save an image if there isnt one
    if (!result || Array.isArray(result) && !result.length) {
      var imgPath = '/var/www/api/sample.jpg';
      const image = fs.readFileSync(imgPath)
      const a = new A()
      a.img.data = image
      a.img.fileName = 'sample.jpg'
      a.img.contentType = 'image/jpg'
      a.fileName = 'sample.jpg'
      a.save(function (err, a) {
        if (err) throw err
        console.log('saved')
      })
    }

    // do something with the image is found
    if (result) {
      console.log(result.img)
      console.log(result.fileName)
      // const path = require('path')
      // const UPLOAD_PATH = '/'
      // fs.createReadStream(path.resolve(UPLOAD_PATH, result.filename)).pipe(res)

      // or
      res.contentType(result.img.contentType)
      res.send(result.img.data)
    }
  })

app.route('/class')
  .get(async(req, res, next) => {

    class AsyncConstructor {

      constructor (id) {
        console.log('inside test class constructor')
        return (async () => {
          await this.stall()
          return this
        })()
      }

      async stall (stallTime = 3000) {
        console.log('Inside inside stall method')
        await new Promise((resolve) => {
          console.log('inside promise method')
          this.id = 9001
          setTimeout(resolve, stallTime)
          this.name = 'Edward'
        })
      }
    }

    console.log('Hey!:)')
    const Instance = await new AsyncConstructor()
    console.log('Created a new object')
    console.log('going to show class')
    console.log(Instance)

    // Example using an async constructor
    //    - please show the constructor in the profile class
    const ProfileModel = require('../models/ProfileModel')
    // just getting the id of a name
    let Main = await new ProfileModel
    console.log(Main)
    await Main.findOneByName('edwuardo')
    const id = Main._id
    Main = null

    // Now example of how to use it NOTE WE ALWAYS HAVE TO USE AWAIT WHEN INSTANTIATNG IT
    const Profile = await new ProfileModel(id)
    console.log(Profile)

})

module.exports = app