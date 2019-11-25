// ///////////////////////////////
// Packages
// ///////////////////////////////
import express from 'express'
const app = express();
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

class Server {

  public app: express.Application;

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
    //create expressjs application
    this.app = express();

    //configure application
    this.config();
  }

// ///////////////////////////////
// HTTP Logging
// ///////////////////////////////
app.use(morgan('dev', {
  skip: function (req, res) {
      return res.statusCode < 400
  }, stream: process.stderr
}));
app.use(morgan('dev', {
  skip: function (req: object, res: object) {
      return res.statusCode >= 400
  }, stream: process.stdout
}));

// ///////////////////////////////
// Server Set Up
// ///////////////////////////////
const logger = Object(require('./helpers/logger')) // .debug, .info, error
const nodeEnv: string = process.env.NODE_ENV || ''
const port = process.env.NODE_PORT
const server = app.listen(port, () => {
  logger.info(`Server has started on ${port} in ${nodeEnv}`)
})

// ///////////////////////////////
// Database Set Up
// ///////////////////////////////
const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  if (nodeEnv === 'development') {
    logger.info(`Connected to ${dbUrl}`)
  }
}).catch(err => {
  logger.error(`Error connecting to database: ${err.message}`)
})

// ///////////////////////////////
// Define the routes
// ///////////////////////////////
const profileRoute = require('./routes/profile.js')
const indexRoute = require('./routes/index.js')
app.use('/profile', profileRoute)
app.use('/', indexRoute)

// ///////////////////////////////
// Configurations
// ///////////////////////////////
app.set('view engine', 'pug') // view engine
app.set('views', __dirname + '/views') // set dir to look for views
app.use(express.static(__dirname + '/public')) // serve from public
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())