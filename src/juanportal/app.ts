// ///////////////////////////////
// Packages
// ///////////////////////////////
import express from 'express'
const morgan = require('morgan')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('./helpers/logger')
const socketIo = require('socket.io')

/**
 * Server
 * 
 * The foundation and entry point for the application
 * 
 * @author    Edward Bebbington
 * 
 * @example
 *            const server = Server.bootstrap()
 *            const app = server.app
 * 
 * @fires     Server#start
 * @fires     Server#initiateLogging
 * @fires     Server#defineRoutes
 * @fires     Server#configure
 * 
 * @property  {express.Application}     app             - Express app object
 * @property  {string}                  viewEngine      - View engine to use
 * @property  {string}                  env             - The environment to run in
 * 
 * @function  bootstrap                 - Return an start an instance of the class
 * @function  constructor               - Fires events
 * @function  initiateLogging           - Start HTTP logging
 * @function  defineRoutes              - Set up the routes
 * @function  configure                 - Configure such as view engine
 * 
 * @returns   {ng.auto.IInjectorService} - Returns the newly created injector for this app.
 * 
 * @since     25/11/2019
 * 
 */
class Server {

  /**
   * Application object
   * 
   * @var any     public
   */
  public app: express.Application;

  /**
   * View engine to use
   * 
   * @var string  private
   */
  private readonly viewEngine: string

  /**
   * Environment to run e.g development, staging
   * 
   * @var string  private
   */
  private readonly env: string

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // define properties
    this.viewEngine = 'pug'
    this.env = process.env.NODE_ENV || ''
    //create expressjs application
    this.app = express();
    //@ts-ignore
    this.app.io = socketIo()
    //configure application
    this.configure();
    // start HTTP logging
    this.initiateLogging()
    // setup routes
    this.defineRoutes()
  }

  /**
   * Configure the node application
   * 
   * @class Server
   * @method configure
   * @return {void}
   */
  private configure (): void {
    this.app.set('view engine', this.viewEngine) // view engine
    this.app.set('views', __dirname + '/views') // set dir to look for views
    this.app.use(express.static(__dirname + '/public')) // serve from public
    this.app.use(cookieParser())
    this.app.use(bodyParser.json({limit: '50mb'}))
    this.app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
  }

  /**
   * Initiate Morgan to start logging HTTP requests
   * 
   * @class Server
   * @method initiateLogging
   * @return {void}
   */
  private initiateLogging (): void {
    if (this.env === 'production') {
      this.app.use(morgan('combined'))
    }
    // Everything else use development logging
    if (this.env !== 'production') {
      this.app.use(morgan('dev', {
        skip: function (req: any, res: any) {
            return res.statusCode < 400
        }, stream: process.stderr
      }));
      this.app.use(morgan('dev', {
        skip: function (req: any, res: any) {
            return res.statusCode >= 400
        }, stream: process.stdout
      }));
    }
  }

  /**
   * Set up and define the routes
   * 
   * @class Server
   * @method defineRoutes
   * @return {void}
   */
  private defineRoutes (): void {
    const profileRoute = require('./routes/profile.js')
    const indexRoute = require('./routes/index.js')
    const chatRoute = require('./routes/chat.js')
    this.app.use('/profile', profileRoute)
    //this.app.use('/chat', chatRoute)
    this.app.use('/', indexRoute)
  }
}

const server = Server.bootstrap()
module.exports = server.app

// ///////////////////////////////
// HTTP Logging
// ///////////////////////////////
// app.use(morgan('dev', {
//   skip: function (req, res) {
//       return res.statusCode < 400
//   }, stream: process.stderr
// }));
// app.use(morgan('dev', {
//   skip: function (req: object, res: object) {
//       return res.statusCode >= 400
//   }, stream: process.stdout
// }));

// ///////////////////////////////
// Server Set Up
// ///////////////////////////////
// const logger = Object(require('./helpers/logger')) // .debug, .info, error
// const nodeEnv: string = process.env.NODE_ENV || ''
// const port = process.env.NODE_PORT
// const server = app.listen(port, () => {
//   logger.info(`Server has started on ${port} in ${nodeEnv}`)
// })

// ///////////////////////////////
// Database Set Up
// ///////////////////////////////
// const dbUrl = process.env.DB_URL
// mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
//   if (nodeEnv === 'development') {
//     logger.info(`Connected to ${dbUrl}`)
//   }
// }).catch(err => {
//   logger.error(`Error connecting to database: ${err.message}`)
// })

// ///////////////////////////////
// Define the routes
// ///////////////////////////////
// const profileRoute = require('./routes/profile.js')
// const indexRoute = require('./routes/index.js')
// app.use('/profile', profileRoute)
// app.use('/', indexRoute)

// ///////////////////////////////
// Configurations
// ///////////////////////////////
// app.set('view engine', 'pug') // view engine
// app.set('views', __dirname + '/views') // set dir to look for views
// app.use(express.static(__dirname + '/public')) // serve from public
// app.use(cookieParser())
// app.use(bodyParser.urlencoded({ extended: false}))
// app.use(bodyParser.json())