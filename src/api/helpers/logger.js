const winston = require('winston')
require('dotenv').config()
const { rootDir } = require('../api.config')
const errorLogFile = rootDir + '/logs/error.log'
let logger = {}

// Log to file for production
if (process.env.NODE_ENV === 'production') {
    logger = new winston.createLogger({
        format: winston.format.combine(
            winston.format.simple(),
            winston.format.align()
        ),
        transports: [
            new winston.transports.File({
                filename: errorLogFile,
                level: 'warn'
            })
        ]
    });
}

// Log to console for anything else
if (process.env.NODE_ENV !== 'production') {
    logger = new winston.createLogger({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.align()
        ),
        transports: [
            new winston.transports.Console({
                level: 'debug',
                timestamp: function () {
                    return (new Date()).toISOString();
                }
            })
        ]
    });
}

module.exports = logger