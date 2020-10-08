console.log('hi')
const express = require('express')
const http = require('http')
const app = express()
import SocketServer from '.././socket'
require('dotenv').config()
const port = process.env.NODE_PORT || 9009
import socketIo, { Server as SocketIOServer } from 'socket.io'

app.set('port', port)

const server = http.createServer(app)
const io = socketIo(server)

server.listen(port)
server.on('error', onError)
io.attach(server)

const socket = new SocketServer(io)
socket.handle()

function onError (this: any, error: any) {
  console.log('on error')
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof this.port === 'string'
    ? 'Pipe ' + this.port
    : 'Port ' + this .port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}
server.on('listening', function () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
})

module.exports = server