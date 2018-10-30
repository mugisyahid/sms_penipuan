'use strict'
const winston = require('winston')
require('winston-daily-rotate-file')
const { combine, timestamp, label, printf } = winston.format;

const fs = require('fs');
const logDir = './log'
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}


const tsFormat = () => (new Date()).toLocaleTimeString();

const logFormat = printf(info => {
    return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

const transports = {
    console: new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: tsFormat
    }), timestamp: tsFormat,
    file: new (winston.transports.DailyRotateFile)({
        filename: './var/log/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
    })
}

const logger = winston.createLogger({
    format: combine(
        label({ label: '' }),
        timestamp(),
        logFormat
    ),
    transports: [transports.console, transports.file],
    exitOnError: false
});

module.exports = logger;