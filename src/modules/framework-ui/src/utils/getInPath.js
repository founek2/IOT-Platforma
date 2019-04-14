import { curry, path, split } from 'ramda';

const getInPath = curry((pathToData, obj) => path(split('.', pathToData), obj));

export default getInPath;