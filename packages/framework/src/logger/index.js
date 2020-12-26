import logger from './fn'

const baseLogger = logger(false);

const consoleLog = baseLogger(console);

export const infoLog = consoleLog('green', 'INFO');
export const warningLog = consoleLog('yellow', 'WARNING');
export const errorLog = consoleLog('red', 'ERROR');
export const devLog = consoleLog('blue', 'DEV', true);

