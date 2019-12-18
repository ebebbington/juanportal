const express = require('express')
const app = express()
const JWT = require('../helpers/JWT')

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

module.exports = app