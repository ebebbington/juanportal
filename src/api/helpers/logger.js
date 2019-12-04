const winston = require('winston')

const level = process.env.LOG_LEVEL || 'debug';

const logger = new winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.align()
    ),
    transports: [
        new winston.transports.Console({
            level: level,
            timestamp: function () {
                return (new Date()).toISOString();
            }
        })
    ]
});

module.exports = logger