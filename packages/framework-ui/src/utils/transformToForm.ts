import setInPath from './setInPath';
import { forEachObjIndexed, is } from 'ramda';

function recursive(transform: any, predicate: any, object: any) {
    const func = (accum = '') => (value: any, key: any) => {
        if (predicate(value)) return rec(value, accum + key + '.');
        transform(value, accum + key);
    };

    function rec(obj: any, accum?: any) {
        forEachObjIndexed(func(accum), obj);
    }
    rec(object);
}

export function transformToForm(formName: string, fields: any) {
    let result = {};
    recursive(
        (val: any, deepPath: any) => {
            const newVal = { ...val, deepPath: val.deepPath.replace(/[^.]*/, formName) };
            result = setInPath(deepPath, newVal, result);
        },
        (val: any) => is(Object, val) && !val.deepPath,
        fields
    );

    return result;
}
