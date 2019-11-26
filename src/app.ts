// ///////////////////////////////
// Packages
// ///////////////////////////////
import express from 'express'
// const app = express();
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

/**
 * Server
 * 
 * The foundation and entry point for the application
 * 
 * @author    Edward Bebbington
 * 
 * @example   Server.bootstrap() || const Server: any = Server.bootstrap()
 * 
 * @fires     Server#start
 * @fires     Server#initiateLogging
 * @fires     Server#defineRoutes
 * @fires     Server#configure
 * @fires     Server#instantiateDbConnection
 * 
 * @property  {any}     app             - App object
 * @property  {string}  viewEngine      - View engine to use
 * @property  {string}  env             - The environment to run in
 * @property  {any}     port            - The port for the node server to run on
 * @property  {string}  dbUrl           - URL of the database to connect to
 * 
 * @function  bootstrap                 - Return an start an instance of the class
 * @function  constructor               - Fires events
 * @function  initiateLogging           - Start HTTP logging
 * @function  start                     - Start the server
 * @function  defineRoutes              - Set up the routes
 * @function  configure                 - Configure such as view engine
 * @function  instantiateDbConnection   - Create connection to database
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
   * public @var any
   */
  public app: express.Application;

  /**
   * View engine to use
   * 
   * private @var string
   */
  private viewEngine: string

  /**
   * Environment to run e.g development, staging
   * 
   * private @var string
   */
  private env: string

  /**
   * Port for the Node server to listen on
   * 
   * private @var any
   */
  private port: any

  /**
   * Url to use when connecting to the mongoose database
   * 
   * private @var string
   */
  private dbUrl: string

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
    this.port = process.env.PORT || 3005
    this.dbUrl = process.env.DB_URL || ''
    //create expressjs application
    this.app = express();
    // start server
    this.start()
    //configure application
    this.configure();
    // start HTTP logging
    this.initiateLogging()

    this.defineRoutes()
    this.instantiateDbConnection()
  }

  /**
   * Start the server
   * 
   * @class Server
   * @method start
   * @return {void}
   */
  start (): void {
    this.app.listen(this.port, () => {
      console.info('Server started')
    })
  }

  /**
   * Configure the node application
   * 
   * @class Server
   * @method configure
   * @return {void}
   */
  configure (): void {
    this.app.set('view engine', this.viewEngine) // view engine
    this.app.set('views', __dirname + '/views') // set dir to look for views
    this.app.use(express.static(__dirname + '/public')) // serve from public
    this.app.use(cookieParser())
    this.app.use(bodyParser.urlencoded({ extended: false}))
    this.app.use(bodyParser.json())
  }

  /**
   * Initiate Morgan to start logging HTTP requests
   * 
   * @class Server
   * @method initiateLogging
   * @return {void}
   */
  initiateLogging (): void {
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

  /**
   * Set up and define the routes
   * 
   * @class Server
   * @method defineRoutes
   * @return {void}
   */
  defineRoutes (): void {
    const profileRoute = require('./routes/profile.js')
    const indexRoute = require('./routes/index.js')
    this.app.use('/profile', profileRoute)
    this.app.use('/', indexRoute)
  }

  /**
   * Make the conection to the database
   * 
   * @class Server
   * @method instantiateDbConnection
   * @return {void}
   */
  instantiateDbConnection (): void {
    mongoose.connect(this.dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(() => {
        if (this.env === 'development') {
          console.info('Database connection has opened')
        } 
      })
      .catch((err: any) => {
        console.info('Error when making conn to db')
        console.error(err)
      })
  }
}

// Instantiate the server
Server.bootstrap()

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