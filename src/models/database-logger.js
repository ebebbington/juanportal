const mongoose = require('mongoose')
const db = mongoose.connection
module.exports = function () {
  db.on('error', console.error.bind( // on mongoose error
    console, 'connection error'
  ))
  db.once('open', function () { // on connect
    console.info('db connected')
  })
  db.once('close', function () { // on close
    console.info('db closed')
  })
  db.once('disconnect', function () { // on disconnect
    console.info('db disconnected')
  })
  process.on('SIGINT', function () { // on node process ending
    mongoose.disconnect()
    console.info('db disconnected due to node process ending')
  })
}