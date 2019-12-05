const express = require('express')
const router = express.Router()

// On '/' render index.pug in views/ as pug expects it to be in views
router
  .get('/', (req, res) => {
    return res.render('index.pug', { // pass in variables to the file
        title: 'Homepage'
    })
})

module.exports = router