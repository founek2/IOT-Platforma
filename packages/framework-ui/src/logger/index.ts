import { logger } from './fn'

const loggerCSS = logger(true);

const consoleLog = loggerCSS(console);
export const baseLogger = consoleLog('bold', "Log>")

export const infoLog = consoleLog('green', 'INFO');
export const warningLog = consoleLog('orange', 'WARNING');
export const errorLog = consoleLog('red', 'ERROR');
export const devLog = consoleLog('blue', 'DEV', true);

export const info = consoleLog('green', 'INFO');
export const warning = consoleLog('orange', 'WARNING');
export const error = consoleLog('red', 'ERROR');
export const dev = consoleLog('blue', 'DEV', true);
export const debug = consoleLog('blue', 'debug', true);

export default {
    log: baseLogger,
    info,
    warning,
    error,
    debug,
}