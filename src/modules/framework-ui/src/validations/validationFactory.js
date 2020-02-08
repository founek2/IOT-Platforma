import { errorLog } from '../Logger';
import ValiadtionMessages from '../localization/validationMessages';
import * as validationFunctions from './validationFn';

let validationFns = validationFunctions;

export function validationFactoryFn() {
	return function(functionName, arg) {
		return function(fieldValue) {
			const Fn = validationFns[functionName];
			if (Fn) {
				const result = Fn(fieldValue, arg);
				if (result !== true) {
					return ValiadtionMessages.getMessage(result, fieldValue, arg)
				} else {
					return true; // Validation passed
				}
			} else {
				errorLog("Missing validation Fn named: " + functionName);
				throw new Error("Missing validation Fn named: " + functionName)
			}
		}
	}
}

export function registerFunctions(functions) {
	validationFns = {...validationFns, ...functions}
}

export default validationFactoryFn();