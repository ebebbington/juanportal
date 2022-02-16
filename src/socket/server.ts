import express from "express";
import http, { Server as HTTPServer } from "http";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT as string;
/* istanbul ignore if */
if (!port) {
  throw new Error("PORT env var must be set");
}
import { Server as SocketIOServer } from "socket.io";
import SocketServer from "./socket";

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
  private readonly httpServer: HTTPServer;

  /**
   * @var {express.Application} Used to be passed into the HTTP server for easier setup
   */
  public readonly app: express.Application;

  /**
   * @var {SocketIOServer} The SocketIO connection (io)
   */
  private readonly io: SocketIOServer;

  /**
   * @var {string} Port For the HTTP server to listen on
   */
  private readonly port: string = port;

  /**
   * Usual setup and configuration
   */
  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    //this.io = socketIo.listen(this.httpServer);
    this.io = new SocketIOServer(this.httpServer, { transports: ["polling"] });
    this.configure();
    this.listen();
    this.handleSocketConnection();
  }

  /**
   * @method configure
   *
   * @description
   * Configure the server
   */
  private configure(): void {
    this.app.set("port", this.port);
    this.io.attach(this.httpServer);
  }

  /**
   * @method handleSocketConnection
   *
   * @description
   * Create an instance of the Socket server and pass the SocketIO object to the Socket server to handle everything
   */
  private handleSocketConnection(): void {
    const socket = new SocketServer(this.io);
    socket.handle();
  }

  /**
   * @method listen
   *
   * @description
   * Start the server
   */
  private listen(): void {
    this.httpServer.listen(this.port, () => {
      console.log("Listening on " + this.port);
    });
  }

  public close(): void {
    this.httpServer.close();
    this.io.close();
  }
}

const server = new Server();
export default server;
