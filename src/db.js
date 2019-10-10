const mongoose = require('mongoose')

const db = mongoose.connection
module.exports = function () {
    db.on('error', console.error.bind( // on mongoose error
      console, 'connection error'
    ))
    db.once('open', function () { // on connect
      console.info('db connection opened')
    })
    db.once('close', function () { // on close
      console.info('db connection closed')
    })
    db.once('disconnect', function () { // on disconnect
      console.info('db connection disconnected')
    })
    process.on('SIGINT', function () { // on node process ending
      console.info('node process is ending')
    })
  }