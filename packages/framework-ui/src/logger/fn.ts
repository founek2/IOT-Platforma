const currentLogLevel = Number(process.env.LOG_LEVEL || process.env.REACT_APP_LOG_LEVEL || '2');
console.log(`Loglevel is set to ${currentLogLevel}`);

const styleArray = {
    red: ['color: red', '\x1b[31m'],
    green: ['color: green', '\x1b[32m'],
    yellow: ['color: #dddd36', '\x1b[33m'],
    reset: ['color:unset', '\x1b[0m'],
    orange: ['color: #f57c00', '\x1b[95m'],
    bold: ['color:unset; font-weight: bold;'],
    blue: ['color:#4095ec', '\x1b[34m'],
};

export function logger(useCss = true, styles = styleArray) {
    let entry;
    return function configLogger(logger: any, logMethod = 'log') {
        const log = logger[logMethod];
        return function loggerColor(color: keyof typeof styleArray, message = '', logLevel: number) {
            const style = styles[color];
            return function (...value: any[]) {
                // create entry message (true = browser / false = server)
                if (useCss) entry = [`%c${message}`, style[0]];
                else {
                    entry = [`${style[1]}${message}${styles['reset'][1]}`];
                }

                // log message
                if (process.env.LOG_LEVEL && currentLogLevel >= logLevel)
                    log.apply(logger, [new Date().toLocaleTimeString(), ...entry, ...value]); // logger: Console

                return value;
            };
        };
    };
}
