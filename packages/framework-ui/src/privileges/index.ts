import {
    pick,
    prop,
    forEach,
    map,
    o,
    compose,
    when,
    uniqBy,
    flip,
    equals,
    uniq as Runiq,
    isNil,
    not,
    filter,
} from 'ramda';

interface Privileges {
    groupsHeritage: { [group: string]: string[] };
    routes: { [group: string]: { allowedGroups: string[] } };
}

// TODO rewrite + add unit tests
const isNotNil = o(not, isNil);
const getRoutes = (privileges: Privileges) => privileges.routes;

const getArrayOfPaths = (privObj: Privileges) => (groupName: string) => {
    // @ts-ignore
    return (compose(prop('routes'), prop(groupName), getRoutes)(privObj) as any[]) || [];
};

// const getArray0fGroups = privObj => compose(prop('allowedGroups'), flip(prop)(privObj));
const getArray0fGroups = (privObj) => (groupName) => o(prop('allowedGroups'), prop(groupName))(privObj);
let privileges: Privileges = { groupsHeritage: {}, routes: {} };

// export const groupsHeritage = {
//     root: ['user', 'admin', 'flow'],
//     admin: ['user', 'flow'],
// };

// export const routes = {
//     user: {
//         allowedGroups: allowedGroups.user,
//     },
//     admin: {
//         allowedGroups: allowedGroups.admin,
//     },
//     root: {
//         allowedGroups: allowedGroups.root,
//     },
// };
export function enrichGroups(groups) {
    const out = [...groups];
    forEach(
        o(
            when(isNotNil, (arrOfGroups) => out.push(...arrOfGroups)),
            flip(prop)(privileges.groupsHeritage)
        ),
        groups
    );
    return Runiq(out);
}

export function getPaths(groups) {
    const enrichedGroups = enrichGroups(groups);
    const output = [];

    const convertPrivToPaths = compose(
        (array: any[]) => array && output.push(...array),
        filter(o(isNotNil, prop('name'))),
        getArrayOfPaths(privileges)
    );
    forEach(convertPrivToPaths, enrichedGroups);
    const uniq = uniqBy(prop('path'), output);
    return uniq;
}

export function getPathsWithComp(groups) {
    const output = [];

    const convertPrivToPaths = compose(
        (array: any[]) => array && output.push(...array),
        filter(o(isNotNil, prop('Component'))),
        getArrayOfPaths(privileges)
    );

    forEach(convertPrivToPaths, enrichGroups(groups));
    const uniq = uniqBy(prop('path'), output);
    return uniq;
}

export function getAllowedGroups(groups) {
    const output = [];
    const convertPrivToPaths = o(
        when(isNotNil, (array) => output.push(...array)),
        getArray0fGroups(privileges.routes)
    );
    forEach(convertPrivToPaths, enrichGroups(groups));
    const uniq = uniqBy(prop('name'), output);
    return uniq;
}

// export function areGroupsAllowed(groups, userGroups) {
//      const allowedGroups = getAllowedGroups(userGroups).map(obj => obj.group);
//      console.log("allowed groups", allowedGroups)
//      const diff = difference(enrichGroups(groups), allowedGroups);
//      return diff.length === 0;
// }

export function isGroupAllowed(groupName, groups) {
    return enrichGroups(groups).some(equals(groupName));
}

/**
 * format - {groupName: [{path: /login, component}]}
 */
export default function (routes: any, groupsHeritage: Privileges['groupsHeritage']) {
    privileges = { routes, groupsHeritage };
}
