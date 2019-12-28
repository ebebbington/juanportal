const express = require('express')
const router = express.Router()
const app = express()
const logger = require('../helpers/logger')
const util = require('util')
const ImageHelper = require('../helpers/ImageHelper')


// For when an image is submited in the form when POSTing a profile
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.route('/id/:id')
  .get((req, res) => {
    const id = req.params.id
    res.status(200).render('profile/view', {title: 'View Profile', id: id})
  })

app.route('/add')
  .get((req, res) => { res.status(200).render('profile/add', {title: 'Add a profile'})})

app.route('/image')
  .post(upload.single('image'), (req, res) => {
    logger.info('[POST /profile/image]')
    const filename = req.query.filename
    const Image = new ImageHelper
    const saved = Image.saveToFS(filename, req.file)
    if (!saved) {
      return res.status(500).json({success: false, message: 'Failed to save the file'})
    }
    if (saved) {
      return res.status(200).json({success: true, message: 'Saved the file'})
    }
    console.log(req.body)
    console.log(req.file)
    res.status(200).json({success: true}).end()
  })

  .delete(upload.single('image'), (req, res) => {
    // todo add checks so people just cant willy nilly send requests
    const filename = req.query.filename
    const Image = new ImageHelper
    const success = Image.deleteFromFS(filename)
    if (!success) {
      return res.status(500).json({success: false, message: 'Failed to delete the file'})
    }
    if (success) {
      return res.status(200).json({success: true, message: 'Deleted the file'})
    }
  })

module.exports = app