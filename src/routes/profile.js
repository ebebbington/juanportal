const app = require('express')()
const ProfileController = require('../controllers/ProfileController.js')

// For when an image is submited in the form when POSTing a profile
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

/**
 * /profile?id
 */
app.get("/", ProfileController.get)
/**
 * /profile/add
 */
app.get('/add', ((req, res) => { res.render('profile/add', {title: 'Add a profile'})}))
/**
 * /profile/add
 */
app.post('/add', upload.single('image'), ProfileController.post)
/**
 * /profile/delete?id
 */
app.get('/delete', ProfileController.delete)

module.exports = app