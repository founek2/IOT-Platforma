import {isString} from 'framework-ui/src/validations/validationFn'

export const isColor = (value) => isString(value, {startsWith: "#", min:2, max:7}) == true? true : "isNotColor";