const express = require('express')
const app = express()
const RedisHelper = require('../helpers/RedisHelper')
const Redis = new RedisHelper({cache: true})

app.route('/')
  .get(Redis.cache.route('chat'), (req, res) => {
      res.render('chat', {title: 'Chat'})
  })

module.exports = app