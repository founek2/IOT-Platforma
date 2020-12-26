import { is, and, has, or, equals, isNil } from 'ramda'
import * as types from '../types'
import isNotEmpty from '../utils/isNotEmpty'

type validationFn = types.validationFn

const maxLength = (value: Array<any> | string, max: number) => value && value.length <= max

const minLength = (value: Array<any> | string, min: number) => value && min <= value.length

export const isBool: validationFn = value =>
    is(Boolean, value) || value === 'true' || value === 'false' ? true : 'notBool'

export const isString: validationFn = (value, { min, max, startsWith, notEqual, pattern } = {}) => {
    if (!is(String, value)) return `notString`

    if (startsWith && !(new RegExp(`^${startsWith}`).test(value))) return 'notStartsWith'
    if (min && !minLength(value, min)) return 'lowerLength'
    if (max && !maxLength(value, max)) return 'higherLength'
    if (pattern && !pattern.test(value)) return 'notMatchPattern'
    if (notEqual && equals(value, notEqual)) return "stringCannotEqualTo"
    return true
}

export const noNumbers: validationFn = value => {
    return !/[0-9]/.test(value) || 'cannotContainNumbers'
}
const minValue = (value: number, min: number) => min <= value

const maxValue = (value: number, max: number) => value <= max

export const isNumber: validationFn = (value, { max, min } = {}) => {
    if (typeof value != "number"
        && !(is(String, value) && /^[-+]?([0-9]*\.[0-9]+|[0-9]+)$/.test(value))) return `notNumber`  // because input can save it as text
    if (min && !minValue(value, min)) return 'lowerValue'
    if (max && !maxValue(value, max)) return 'higherValue'
    return true
}

export const isRequired: validationFn = value => {
    // console.log(value, isNotNil(value), isNotNil(value), isNotEmpty(value))
    return (!isNil(value) && isNotEmpty(value)) || 'isRequired'
}

export const isNotEmptyArray: validationFn = value => (is(Array, value) && isNotEmpty(value)) || 'isRequired'

export const isArray: validationFn = value => (is(Array, value)) || 'isRequired'

export const isPhoneNumber: validationFn = value => /^(\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/.test(value) || 'isNotPhoneNumber'

export const isEmail: validationFn = value => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/.test(value) || 'isNotEmail'

export const isFile: validationFn = value => and(or(has('data', value), has('url', value)), has('name', value)) || 'isNotFile'    // TODO validate extension

export const isOneOf: validationFn = (value, { values }: { values: Array<any> }) => values.some(val => value === val) || "isNotOneOf"

export const isTime: validationFn = (value) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) || "isNotTime"

export const isIpAddress: validationFn = (value) => /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/.test(value) || "isNotIpAddress"