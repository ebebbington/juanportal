// ///////////////////////////////
// Packages
// ///////////////////////////////
import express from 'express'
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('./helpers/logger')

/**
 * Server
 * 
 * The foundation and entry point for the application
 * 
 * @author    Edward Bebbington
 * 
 * @example   const app = require('app') //express app object
 * 
 * @fires     Server#start
 * @fires     Server#initiateLogging
 * @fires     Server#defineRoutes
 * @fires     Server#configure
 * @fires     Server#instantiateDbConnection
 * 
 * @property  {express.Application}     app             - Express app object
 * @property  {string}                  env             - The environment to run in
 * @property  {string}                  dbUrl           - URL of the database to connect to
 * 
 * @function  bootstrap                 - Return an start an instance of the class
 * @function  constructor               - Fires events
 * @function  initiateLogging           - Start HTTP logging
 * @function  defineRoutes              - Set up the routes
 * @function  configure                 - Configure such as view engine
 * @function  instantiateDbConnection   - Create connection to database
 * @function  initiateDbLogging         - Start listening for events on the database and log them
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
   * @var {express.Application} public
   */
  public app: express.Application;

  /**
   * Environment to run e.g development, staging
   * 
   * @var {string} private
   */
  private readonly env: string

  /**
   * Url to use when connecting to the mongoose database
   * 
   * @var {string} private
   */
  private readonly dbUrl: string

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
    this.env = process.env.NODE_ENV || ''
    // this.port = process.env.PORT || 3005
    this.dbUrl = process.env.DB_URL || ''
    //create expressjs application
    this.app = express();
    //configure application
    this.configure();
    // start HTTP logging
    this.initiateLogging()
    // setup routes
    this.defineRoutes()
    // connect to the database
    this.instantiateDbConnection()
    // start db logging
    this.initiateDbLogging()
  }

  /**
   * Configure the node application
   * 
   * @class Server
   * @method configure
   * @return {void}
   */
  private configure (): void {
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
  private initiateLogging (): void {
    // For production environment
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
    this.app.use('/api/profile', profileRoute)
    const testRoute = require('./routes/test.js')
    this.app.use('/api/test', testRoute)
  }

  /**
   * Make the connection to the database
   * 
   * @class Server
   * @method instantiateDbConnection
   * @return {void}
   */
  private instantiateDbConnection (): void {
    mongoose.connect(this.dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(() => {
        if (this.env === 'development') {
          logger.info('Database connection has opened')
        } 
      })
      .catch((err: any) => {
        logger.info('Error when making conn to db')
        logger.error(err)
      })
  }

  /**
   * Start logging database actions
   *
   * @class Server
   * @method initiateDblogging
   * @return {void}
   */
  private initiateDbLogging (): void {
    mongoose.connection
        .on('connecting', () => {
          logger.info('Connecting to the database')
        })
        .on('connected', () => {
          logger.info('Connected to the database')
        })
        .on('close', () => {
          logger.info('Closed the connection to the database')
        })
        .on('error', () => {
          logger.error('Connection error with the database')
        })
        .on('disconnected', () => {
          logger.info('Lost connection with the database')
        })
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