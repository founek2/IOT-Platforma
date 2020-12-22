import { curry, dissocPath, split, compose, map, equals } from 'ramda';

/**
 * Warning - from array it completely removes element (moves rest to it's position)
 */
const setInPath: (deepPath: string, objToInsert: any) => any = curry(
    (pathToData, obj) => dissocPath(compose(map((val) => {
        const arrIdx = parseInt(val); // eslint-disable-line
        return equals(NaN, arrIdx) ? val : arrIdx;
    }), split('.'))(pathToData), obj));

export default setInPath