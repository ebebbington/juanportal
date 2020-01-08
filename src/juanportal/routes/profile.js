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
  .get((req, res) => { res.status(200).render('profile/add', {title: 'Add Profile'})})

app.route('/image')
  /**
   * @example
   * const form = $('form')[0]
   * $.ajax({
      url: '/profile/image?filename=' + filename,
      method: 'post',
      processData: false,
      contentType: false,
      dataType: 'json',
      data: new FormData(form)
    })
   */
  .post(upload.single('image'), (req, res) => {
    // todo add checks so people just cant willy nilly send requests e.g. JWT 
    logger.info('[POST /profile/image]')
    const filename = req.query.filename
    if (!filename) {
      return res.status(400).json({success: false, message: 'No filename was passed in'})
    }
    const Image = new ImageHelper
    const saved = Image.saveToFS(filename, req.file)
    if (!saved) {
      return res.status(500).json({success: false, message: 'Failed to save the file'})
    }
    if (saved) {
      return res.status(200).json({success: true, message: 'Saved the file'})
    }
  })

  /**
   * @example
   * cobst filename: string = 'get the filename here without the path'
   * $.ajax({
      url: '/profile/image?filename=' + filename,
      method: 'delete',
      dataType: 'json',
    })
   */
  .delete(upload.single('image'), (req, res) => {
    // todo add checks so people just cant willy nilly send requests e.g. JWT
    const filename = req.query.filename
    const Image = new ImageHelper
    // check it exists first
    const exists = Image.existsOnFS(filename)
    if (!exists) {
      return res.status(404).json({success: false, message: 'File was not found on the server'})
    }
    const stillExists = Image.deleteFromFS(filename)
    if (stillExists) {
      return res.status(500).json({success: false, message: 'Failed to delete the file'})
    }
    if (!stillExists) {
      return res.status(200).json({success: true, message: 'Deleted the file'})
    }
  })

module.exports = app