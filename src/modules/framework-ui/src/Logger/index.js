const styleArray = {
	red: ['color: red', '\x1b[31m'],
	green: ['color: green', '\x1b[32m'],
	yellow: ['color: #dddd36', '\x1b[33m'],
	orange: ['color: #f57c00'],
	reset: ['color:unset', '\x1b[0m'],
	bold: ['color:unset; font-weight: bold;']
}

function logger(useCss = true, styles = styleArray) {
	let entry;
	return function configLogger(logger, logMethod = 'log') {
		const log = logger[logMethod];
		return function loggerColor(color, message = '') {
			const style = styles[color];
			return function (...args) {
				// create entry message (true = browser / false = server)
				if (useCss) 
					entry = [`%c${message}`, style[0]];
				 else {
					entry = [`${style[1]}${message}${styles['reset'][1]}`];
				 }
				 				
				// log message
				log.apply(logger, [...entry, ...args]); // logger: Console
				return args
			}
		}
	}
}
const loggerCSS = logger(true);

 const consoleLog = loggerCSS(console);
 export const baseLogger = consoleLog('bold', "Log>")

export const infoLog = consoleLog('green', 'INFO');
export const warningLog = consoleLog('orange', 'WARNING');
export const errorLog = consoleLog('red', 'ERROR');

// infoLog({id: 13, user: 'martin'});
// warningLog({id: 13, user: 'martin'});
// errorLog({id: 13, user: 'martin'});