import { curry, assocPath, split, compose, map, equals } from 'ramda';

export default curry(
    (pathToData, value, obj) => assocPath(compose(map((val) => {
        const arrIdx = parseInt(val); // eslint-disable-line
        return equals(NaN, arrIdx) ? val : arrIdx;
    }), split('.'))(pathToData), value, obj));
