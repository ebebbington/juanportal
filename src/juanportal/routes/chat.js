const express = require('express')
const app = express()

app.route('/')
  .get((req, res) => {
      res.render('chat')
  })

module.exports = app