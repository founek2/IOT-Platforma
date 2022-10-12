import { curry, assocPath, split, compose, map, equals } from 'ramda';

// type newObject = any

const setInPath: (deepPath: string, data: any, objToInsert: any) => any = curry(
    (pathToData, value, obj) => assocPath(compose(map((val) => {
        const arrIdx = parseInt(val); // eslint-disable-line
        return equals(NaN, arrIdx) ? val : arrIdx;
    }), split('.'))(pathToData), value, obj));

export default setInPath