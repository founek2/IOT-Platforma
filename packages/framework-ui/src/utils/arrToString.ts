import { reject, isNil, o } from 'ramda';

export default (arr: (null | undefined | string | number | boolean)[]): string =>
    // @ts-ignore
    o((ar) => ar.join().replace(',', ', '), reject(isNil))(arr);
