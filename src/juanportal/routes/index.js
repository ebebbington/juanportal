const express = require('express')
const router = express.Router()
var cache = require('express-redis-cache')({
  host: 'juanportal_redis', port: '6379'
});

// On '/' render index.pug in views/ as pug expects it to be in views
router
  .get('/', (req, res) => {
      cache.route({ prefix: 'view'  }, { expire: 5000  })
    return res.render('index.pug', { // pass in variables to the file
        title: 'Home'
    })
})

module.exports = router