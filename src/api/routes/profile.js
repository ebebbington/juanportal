const express = require('express')
const app = express()
const ProfileController = require('../controllers/ProfileController')
const t = require("../a")

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.route('/count/:count')

  /**
   * @example
   * const numberOfProfiles = 100
   * $.ajax({
   *  url: '/api/profile/count/numberOfProfiles',
   *  method: 'get',
   *  dataType: 'json'
   * })
   */
  .get(ProfileController.GetProfilesByAmount)

app.route('/id/:id')

    /**
     * @example
     * const id = 'get the id here
     * $.ajax({
     *  url: '/api/profile/id/' + id,
     *  method: 'get',
     *  dataType: 'json'
     * })
     */
  .get(ProfileController.GetProfileById)

  /**
     * @example
     * const id = 'get the id here
     * $.ajax({
     *  url: '/api/profile/id/' + id,
     *  method: 'delete',
     *  dataType: 'json'
     * })
     */
  .delete(ProfileController.DeleteProfileById)

app.route('/')

  /**
   * @example
   * const form = $('form')[0]
   * $.ajax({
      url: '/api/profile,
      method: 'post',
      processData: false,
      contentType: false,
      dataType: 'json',
      data: new FormData(form)
    })
   */
  .post(upload.single('image'), ProfileController.PostProfile)

module.exports = app
