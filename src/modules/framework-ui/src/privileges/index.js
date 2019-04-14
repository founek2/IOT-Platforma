import { pick, prop, forEach, map, sortBy, o, compose, when, uniqBy, difference } from 'ramda';
import {isNotNaN, isNotNil} from 'ramda-extension';

const getRoutes = prop("routes");

const getArrayOfPaths = privObj => groupName => {
     const neco = compose(
          prop('routes'),
		prop(groupName),
		getRoutes
	)(privObj);
     return neco;
};

// const getArray0fGroups = privObj => compose(prop('allowedGroups'), flip(prop)(privObj));
const getArray0fGroups = privObj => groupName => o(prop('allowedGroups'), prop(groupName))(privObj);
let privileges = {};
export function getPaths(groups) {
     const output = [];
     const pickPaths = (neco) =>  map(pick(['path', 'name', 'Icon']), neco);
     const convertPrivToPaths = compose(
          when(
			isNotNil,
			o(array => output.push(...array), pickPaths)
		),
          getArrayOfPaths(privileges)
     );
     forEach(convertPrivToPaths, groups);
     const uniq = uniqBy(prop('path'), output);
     return uniq;
}

export function getPathsWithComp(groups) {
	const output = [];

     const convertPrivToPaths = o(array => array && output.push(...array), getArrayOfPaths(privileges));
     forEach(convertPrivToPaths, groups);
     const uniq = uniqBy(prop('path'), output);
     return uniq;
}

export function getAllowedGroups(groups) {
     const output = [];
     const convertPrivToPaths = o(when(isNotNil, array => output.push(...array)), getArray0fGroups(privileges));
     forEach(convertPrivToPaths, groups);
     const uniq = uniqBy(prop('name'), output);
     return uniq;
}

export function areGroupsAllowed(groups, userGroups) {
     const allowedGroups = getAllowedGroups(userGroups).map(obj => obj.group);
     const diff = difference(groups, allowedGroups);
     return diff.length === 0;
}

export function isGroupAllowed(groupName, groups) {
     return areGroupsAllowed([groupName], groups);
}

/**
 * format - {groupName: [{path: /login, component}]}
 */
export default function(routes, groupsHeritage) {
	privileges = {routes, groupsHeritage};
}
