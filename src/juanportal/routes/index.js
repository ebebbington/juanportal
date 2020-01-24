const express = require('express')
const router = express.Router()
const RedisHelper = require('../helpers/RedisHelper')
const Redis = new RedisHelper({cache: true})


// On '/' render index.pug in views/ as pug expects it to be in views
router
  .get('/', Redis.cache.route('index'), (req, res) => {
    return res.render('index.pug', { // pass in variables to the file
        title: 'Home'
    })
})

module.exports = router