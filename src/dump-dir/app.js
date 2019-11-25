"use strict";
// ///////////////////////////////
// Packages
// ///////////////////////////////
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Server = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    function Server() {
        this.express = require('express');
        //create expressjs application
        this.app = express();
        //configure application
        this.config();
    }
    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    Server.bootstrap = function () {
        return new Server();
    };
    Server.prototype.use = function (morgan) { };
    return Server;
}());
('dev', {
    skip: function (req, res) {
        return res.statusCode < 400;
    }, stream: process.stderr
});
;
app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode >= 400;
    }, stream: process.stdout
}));
// ///////////////////////////////
// Server Set Up
// ///////////////////////////////
var logger = Object(require('./helpers/logger')); // .debug, .info, error
var nodeEnv = process.env.NODE_ENV || '';
var port = process.env.NODE_PORT;
var server = app.listen(port, function () {
    logger.info("Server has started on " + port + " in " + nodeEnv);
});
// ///////////////////////////////
// Database Set Up
// ///////////////////////////////
var dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(function () {
    if (nodeEnv === 'development') {
        logger.info("Connected to " + dbUrl);
    }
}).catch(function (err) {
    logger.error("Error connecting to database: " + err.message);
});
// ///////////////////////////////
// Define the routes
// ///////////////////////////////
var profileRoute = require('./routes/profile.js');
var indexRoute = require('./routes/index.js');
app.use('/profile', profileRoute);
app.use('/', indexRoute);
// ///////////////////////////////
// Configurations
// ///////////////////////////////
app.set('view engine', 'pug'); // view engine
app.set('views', __dirname + '/views'); // set dir to look for views
app.use(express.static(__dirname + '/public')); // serve from public
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
