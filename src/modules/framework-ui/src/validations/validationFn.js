import { is, and, has, or, equals } from 'ramda'
import { isNotEmpty } from 'ramda-extension'

const maxLength = (value, max) => value && value.length <= max

const minLength = (value, min) => value && min <= value.length

export const isBool = value =>
     is(Boolean, value) || value === 'true' || value === 'false' ? true : 'notBool'

export const isString = (value, { min, max, startsWith, notEqual } = {}) => {
     if (!is(String, value)) return `notString`
     if (startsWith && !(new RegExp(`^${startsWith}`).test(value))) return 'notStartsWith'
     if (min && !minLength(value, min)) return 'lowerLength'
     if (max && !maxLength(value, max)) return 'higherLength'
     if (notEqual && equals(value, notEqual)) return "stringCannotEqualTo"
     return true
}

export const noNumbers = value => {
     return !/[0-9]/.test(value) || 'cannotContainNumbers'
}
export const minValue = (value, min) => min <= value

export const maxValue = (value, max) => value <= max

export const isNumber = (value, { max, min } = {}) => {
     if ((typeof value != "number" && !(is(String, value) && /[-+]?([0-9]*\.[0-9]+|[0-9]+)/.test(value)))) return `notNumber`  // because input can save it as text
     if (min && !minValue(value, min)) return 'lowerValue'
     if (max && !maxValue(value, max)) return 'higherValue'
     return true
}

export const isRequired = value => (value && isNotEmpty(value)) || 'isRequired'

export const isNotEmptyArray = value => (is(Array, value) && isNotEmpty(value)) || 'isRequired'

export const isPhoneNumber = value => /^(\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/.test(value) || 'isNotPhoneNumber'

export const isEmail = value => /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/.test(value) || 'isNotEmail'

export const isFile = value => and(or(has('data', value), has('url', value)), has('name', value)) || 'isNotFile'    // TODO validate extension
