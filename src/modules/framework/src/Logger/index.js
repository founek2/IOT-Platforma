const styleArray = {
     red: ['color: red', '\x1b[31m'],
     green: ['color: green', '\x1b[32m'],
     yellow: ['color: #dddd36', '\x1b[33m'],
     blue: ['color lightblue', '\x1b[34m'],
     reset: ['color:unset', '\x1b[0m']
};

function logger(useCss = true, styles = styleArray) {
     let entry;
     return function configLogger(logger, logMethod = 'log') {
          const log = logger[logMethod];
          return function loggerColor(color, message = '', devOnly = false) {
               const style = styles[color];
               return function (...value) {
                    // create entry message (true = browser / false = server)
                    if (useCss) entry = [`%c${message}`, style[0]];
                    else {
                         entry = [`${style[1]}${message}${styles['reset'][1]}`];
                    }

                    // log message
                    if ((devOnly && process.env.NODE_ENV === 'development') || !devOnly)
                         log.apply(logger, [...entry, ...value]); // logger: Console

                    return value;
               };
          };
     };
}
const baseLogger = logger(false);

const consoleLog = baseLogger(console);

export const infoLog = consoleLog('green', 'INFO');
export const warningLog = consoleLog('yellow', 'WARNING');
export const errorLog = consoleLog('red', 'ERROR');
export const devLog = consoleLog('blue', 'LOG', true);

// infoLog({id: 13, user: 'martin'});
// warningLog({id: 13, user: 'martin'});
// errorLog({id: 13, user: 'martin'});
