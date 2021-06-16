import * as types from '../types';
import isFn from '../utils/isFn';

export function messageFactory(messages: types.messages) {
    return {
        getMessage: (messageKey: string, fieldValue: any = '', arg?: any) => {
            const message = messages[messageKey];
            if (message) {
                if (isFn(message)) {
                    // @ts-ignore
                    return message({ ...arg, fieldValue });
                } else {
                    return message;
                }
            } else {
                console.error('missing Message: ' + messageKey);
                return '$' + messageKey;
            }
        },
        registerMessages: (moreMessages: types.messages) => {
            messages = { ...messages, ...moreMessages };
        },
    };
}
