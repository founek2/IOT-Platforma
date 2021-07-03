import { is, and, has, or, equals, isNil } from 'ramda';
import * as types from '../types';
import isNotEmpty from '../utils/isNotEmpty';
import { validateFormBE } from './index';
import { transformToForm } from '../utils/transformToForm';

type validationFn = types.validationFn;

const maxLength = (value: Array<any> | string, max: number) => value && value.length <= max;

const minLength = (value: Array<any> | string, min: number) => value && min <= value.length;

export const isBool: validationFn = (value) =>
    is(Boolean, value) || value === 'true' || value === 'false' ? true : 'notBool';

export const isString: validationFn = (value, { min, max, startsWith, notEqual, pattern } = {}) => {
    if (!is(String, value)) return `notString`;

    if (startsWith && !new RegExp(`^${startsWith}`).test(value)) return 'notStartsWith';
    if (min && !minLength(value, min)) return 'lowerLength';
    if (max && !maxLength(value, max)) return 'higherLength';
    if (pattern && !pattern.test(value)) return 'notMatchPattern';
    if (notEqual && equals(value, notEqual)) return 'stringCannotEqualTo';
    return true;
};

export const noNumbers: validationFn = (value) => {
    return !/[0-9]/.test(value) || 'cannotContainNumbers';
};
const minValue = (value: number, min: number) => min <= value;

const maxValue = (value: number, max: number) => value <= max;

export const isNumber: validationFn = (value, { max, min } = {}) => {
    if (typeof value != 'number' && !(is(String, value) && /^[-+]?([0-9]*\.[0-9]+|[0-9]+)$/.test(value)))
        return `notNumber`; // because input can save it as text
    if (min && !minValue(value, min)) return 'lowerValue';
    if (max && !maxValue(value, max)) return 'higherValue';
    return true;
};

export const isRequired: validationFn = (value) => {
    return (!isNil(value) && isNotEmpty(value)) || 'isRequired';
};

export const isArray: validationFn = (value, { descriptor, min, max } = {}) => {
    if (!is(Array, value)) return 'isRequired';
    if (min && !minLength(value, min)) return 'lowerLength';
    if (max && !maxLength(value, max)) return 'higherLength';
    if (!descriptor) return true;

    return (value as Array<any>).map((obj) => isObject(obj, { descriptor })).find((it) => it !== true) || true;
};

export const isNotEmptyArray: validationFn = (value) => isArray(value, { min: 1 });

export const isPhoneNumber: validationFn = (value) =>
    /^(\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/.test(value) || 'isNotPhoneNumber';

export const isEmail: validationFn = (value) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/.test(value) || 'isNotEmail';

export const isFile: validationFn = (value) =>
    and(or(has('data', value), has('url', value)), has('name', value)) || 'isNotFile'; // TODO validate extension

export const isOneOf: validationFn = (value, { values }: { values: Array<any> }) =>
    values.some((val) => value === val) || 'isNotOneOf';

export const isTime: validationFn = (value) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) || 'isNotTime';

export const isIpAddress: validationFn = (value) =>
    /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/.test(value) || 'isNotIpAddress';

export const isObject: validationFn = (value, { descriptor } = {}) => {
    if (typeof value !== 'object') return 'isNotObject';
    if (!descriptor) return true;

    const result = validateFormBE('FORM_NAME', ({
        formsData: ({ FORM_NAME: value } as unknown) as types.formsData,
        fieldDescriptors: { FORM_NAME: transformToForm('FORM_NAME', descriptor) },
    } as unknown) as types.State);

    return result.valid || 'isNotValidObject';
};
