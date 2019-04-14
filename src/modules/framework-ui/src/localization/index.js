import { errorLog } from '../Logger';
import { is } from 'ramda';

const isFn = is(Function);

export function messageFactory(messages){
	return {
		getMessage: (messageKey, fieldValue, arg) => {
			const message = messages[messageKey];
			if (message) {
				if (isFn(message)) {
					return message({ ...arg, fieldValue });
				} else {
					return message;
				}
			} else {
				errorLog('missing Message: ' + messageKey);
				return "$" + messageKey;
			}
		},
		registerMessages: moreMessages => {
			messages = {...messages, ...moreMessages};
		}
	}
}