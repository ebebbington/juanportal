const http = require('http')
const app = require('express')()
const httpServer = http.createServer(app)

function listening () {
	console.log('listening')
}

function onError () {
	console.log('error')
}

httpServer.listen(3005)
httpServer.on('listening', listening)
httpServer.on('error', onError)
