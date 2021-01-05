import http, { Server as HTTPServer } from 'http'
import express, { Application as ExpressApp } from 'express'
require('dotenv').config()
const port: string = process.env.PORT || '9009'
import socketIo, { Server as SocketIOServer } from 'socket.io'
import SocketIO from "socket.io"
import SocketServer from "./socket";
import cors from "cors"

/**
 * @class Server
 *
 * @property  {httpServer}
 * @property  {app}
 * @property  {io}
 * @property  {port}
 *
 * @method    constructor             {@link Server#constructor}
 * @method    configure               {@link Socket#configure}
 * @method    handleSocketConnection  {@link Socket#handleSocketConnection}
 * @method    listen                  {@link Socket#listen}
 */
class Server {

  /**
   * @var {HTTPServer} Basic HTTP Server to start our application
   */
  private readonly httpServer: HTTPServer

  /**
   * @var {ExpressApp} Used to be passed into the HTTP server for easier setup
   */
  public readonly  app: ExpressApp

  /**
   * @var {SocketIOServer} The SocketIO connection (io)
   */
  private readonly io: SocketIOServer

  /**
   * @var {string} Port For the HTTP server to listen on
   */
  private readonly port: string = port

  /**
   * Usual setup and configuration
   */
  constructor () {
    this.app = express()
    this.httpServer = http.createServer(this.app)
    //this.io = socketIo.listen(this.httpServer);
    this.io = socketIo(this.httpServer, { transports: ['polling']})
    this.configure()
    this.listen()
    this.handleSocketConnection()
  }

  /**
   * @method configure
   *
   * @description
   * Configure the server
   */
  private configure () {
    this.app.set('port', this.port)
    this.io.attach(this.httpServer)
  }

  /**
   * @method handleSocketConnection
   *
   * @description
   * Create an instance of the Socket server and pass the SocketIO object to the Socket server to handle everything
   */
  private handleSocketConnection () {
    const socket = new SocketServer(this.io)
    socket.handle()
  }

  /**
   * @method listen
   *
   * @description
   * Start the server
   */
  private listen () {
    this.httpServer.listen(this.port, () => {
      console.log('Listening on ' + this.port)
    })
  }
}

const server = new Server()
export default server