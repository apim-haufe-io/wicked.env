'use strict';

const winston = require('winston');

let logLevel = 'info';
if (process.env.LOG_LEVEL) {
    logLevel = process.env.LOG_LEVEL;
}

const consoleLogger = winston.createLogger({
    level: logLevel,
    transports: [new winston.transports.Console()]
});

function makeLog(moduleName, log) {
    return {
        date: new Date().toISOString(),
        module: moduleName,
        message: log
    };
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

module.exports = logger;
