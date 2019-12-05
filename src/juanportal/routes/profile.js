const express = require('express')
const router = express.Router()
const app = express()


// For when an image is submited in the form when POSTing a profile
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.route('/id/:id')
  //.get(ProfileController.get)
  .get((req, res) => {
    const id = req.params.id
    res.status(200).render('profile/view', {title: 'View Profile', id: id})
  })
  //.delete(ProfileController.delete)
  //.put(ProfileController.update)

app.route('/add')
  .get((req, res) => { res.status(200).render('profile/add', {title: 'Add a profile'})})
  //.post(upload.single('image'), ProfileController.post)

module.exports = app