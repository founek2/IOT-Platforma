import {reject, isNil, o} from 'ramda';

export default (arr) => o((ar) => ar.join().replace(",", ", "), reject(isNil))(arr);