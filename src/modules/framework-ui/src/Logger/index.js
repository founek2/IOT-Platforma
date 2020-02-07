import logger from 'framework/src/Logger/fn'

const loggerCSS = logger(true);

 const consoleLog = loggerCSS(console);
 export const baseLogger = consoleLog('bold', "Log>")

export const infoLog = consoleLog('green', 'INFO');
export const warningLog = consoleLog('orange', 'WARNING');
export const errorLog = consoleLog('red', 'ERROR');
export const devLog = consoleLog('blue', 'DEV', true);