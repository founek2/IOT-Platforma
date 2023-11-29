import { equals } from 'ramda';

export function isRoot(groups: string[]) {
    return groups.some(equals('root'));
}

export function hasGroup(group: string, groups: string[]) {
    return groups.some(equals(group));
}
