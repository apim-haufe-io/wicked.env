'use strict';

const winston = require('winston');

let logLevel = 'info';
if (process.env.LOG_LEVEL) {
    logLevel = process.env.LOG_LEVEL;
}

let consoleLogger;
let makeLog;
if (!process.env.LOG_PLAIN) {
    makeLog = makeLogJson;
    consoleLogger = winston.createLogger({
        level: logLevel,
        format: winston.format.json(),
        transports: [new winston.transports.Console()]
    });
} else {
    makeLog = makeLogPlain;
    consoleLogger = winston.createLogger({
        level: logLevel,
        format: winston.format.simple(),
        transports: [new winston.transports.Console()]
    });
}

consoleLogger.info(makeLog('portal-env:logger', `Setting up logging with log level "${logLevel}" (override with LOG_LEVEL)`));

const logger = (moduleName) => {
    return {
        debug: (log) => {
            consoleLogger.debug(makeLog(moduleName, log));
        },

        info: (log) => {
            consoleLogger.info(makeLog(moduleName, log));
        },

        warn: (log) => {
            consoleLogger.warn(makeLog(moduleName, log));
        },

        error: (log) => {
            consoleLogger.error(makeLog(moduleName, log));
        }
    };
};

// Log formatters

// makeLogPlain makes debugging unit tests a lot easier
function makeLogPlain(moduleName, log) {
    let s = log;
    if (log && typeof(log) !== 'string')
        s = JSON.stringify(log);
    if (log === undefined)
        s = '(undefined)';
    else if (log === null)
        s = '(null)';
    // Special case for logging Error instances
    if (log && log.stack) {
        console.error(log);
    }
    return `${moduleName.padEnd(30)} ${s}`;
}

// This is the standard logger which always outputs a structured JSON
// log.
function makeLogJson(moduleName, log) {
    // level is not used here
    return {
        date: new Date().toISOString(),
        module: moduleName,
        message: log
    };
}

module.exports = logger;
