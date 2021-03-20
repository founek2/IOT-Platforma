import {equals} from 'ramda';

export function isRoot(groups, req) {
     const result = groups.some(equals('root'));
     if (result && req) req.root = true;
     return result;
}
export function isGroup(group, groups) {
     return groups.some(equals(group));
}