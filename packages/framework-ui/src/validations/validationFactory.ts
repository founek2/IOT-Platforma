import ValiadtionMessages from '../localization/validationMessages';
import * as validationFunctions from './validationFn';
import * as types from '../types'

let validationFns = validationFunctions

/** Not supported for now - need to improve TS validation */
export function registerFunctions(functions: Array<types.validationFn>) {
    validationFns = { ...validationFns, ...functions }
}

type ModuleType = typeof validationFunctions

export default function <K extends keyof ModuleType>(functionName: K, arg?: object): (fieldValue: any) => true | string {
    return function (fieldValue: any) {
        const Fn = validationFns[functionName];
        if (Fn) {
            const result = Fn(fieldValue, arg);
            if (result !== true) {
                return ValiadtionMessages.getMessage(result, fieldValue, arg)
            } else {
                return true; // Validation passed
            }
        } else {
            console.error("Missing validation Fn named: " + functionName);
            throw new Error("Missing validation Fn named: " + functionName)
        }
    }
}