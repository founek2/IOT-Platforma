import { curry, path, split } from 'ramda';

const getInPath = curry((pathToData: string, obj: any) => path(split('.', pathToData), obj));

export default getInPath; 