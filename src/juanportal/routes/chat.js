const express = require('express')
const app = express()

app.route('/')
  .get((req, res) => {
      res.render('chat', {title: 'Chat'})
  })

module.exports = app