const winston = require('winston')
require('dotenv').config()
const { rootDir } = require('../juanportal.config')
const errorLogFile = rootDir + '/logs/error.log'

const format = {
    production: winston.format.combine(
      winston.format.simple(),
      winston.format.align()
    ),
    development: [winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.align()
    )]
}

const transports = {
    production: new winston.transports.File({
        filename: errorLogFile,
        level: 'warn'
    }),
    development: [
        new winston.transports.Console({
            level: 'debug',
            timestamp: function () {
                return (new Date()).toISOString();
            }
        })
    ]
}

const env = process.env.NODE_ENV === "production" ? "production" : "development"

const logger = new winston.createLogger({
    format: format[env],
    transports: transports[env]
})

module.exports = logger