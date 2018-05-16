'use strict';

const winston = require('winston');
const os = require('os');

const isLinux = (os.platform() === 'linux');

let logLevel = 'info';
if (process.env.LOG_LEVEL) {
    logLevel = process.env.LOG_LEVEL;
} else {
    // We'll set level debug if we're not on Linux
    if (!isLinux)
        logLevel = 'debug';
}

let consoleLogger;
let makeLog;

let useJsonLogging = true;
let remarkPlainLogging = false;
if (process.env.LOG_PLAIN) {
    useJsonLogging = false;
} else if (process.env.LOG_PLAIN !== 'false') {
    // Perhaps we'll default to plain logging anyway
    if (!isLinux) {
        remarkPlainLogging = true;
        useJsonLogging = false;
    }
}

if (useJsonLogging) {
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

if (remarkPlainLogging) {
    consoleLogger.info(makeLog('portal-env:logger', 'Using plain logging format on non-Linux OS; override with LOG_PLAIN=false'));
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
    if (log && typeof (log) !== 'string')
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
