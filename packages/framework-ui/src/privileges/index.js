import { pick, prop, forEach, map, o, compose, when, uniqBy, flip, equals, uniq as Runiq } from 'ramda';
import { isNotNil } from 'ramda-extension';

// TODO rewrite + add unit tests

const getRoutes = prop('routes');

const getArrayOfPaths = (privObj) => (groupName) => {
	const neco = compose(prop('routes'), prop(groupName), getRoutes)(privObj);
	return neco;
};

// const getArray0fGroups = privObj => compose(prop('allowedGroups'), flip(prop)(privObj));
const getArray0fGroups = (privObj) => (groupName) => o(prop('allowedGroups'), prop(groupName))(privObj);
let privileges = {};

export function enrichGroups(groups) {
	const out = [ ...groups ];
	forEach(
		o(when(isNotNil, (arrOfGroups) => out.push(...arrOfGroups)), flip(prop)(privileges.groupsHeritage)),
		groups
	);
	return Runiq(out);
}

export function getPaths(groups) {
	const enrichedGroups = enrichGroups(groups);
	const output = [];
	const pickPaths = (neco) => map(pick([ 'path', 'name', 'Icon' ]), neco);
	const convertPrivToPaths = compose(
		when(isNotNil, o((array) => output.push(...array), pickPaths)),
		getArrayOfPaths(privileges)
	);
	forEach(convertPrivToPaths, enrichedGroups);
	const uniq = uniqBy(prop('path'), output);
	return uniq;
}

export function getPathsWithComp(groups) {
	const output = [];

	const convertPrivToPaths = o((array) => array && output.push(...array), getArrayOfPaths(privileges));
	forEach(convertPrivToPaths, enrichGroups(groups));
	const uniq = uniqBy(prop('path'), output);
	return uniq;
}

export function getAllowedGroups(groups) {
	const output = [];
	const convertPrivToPaths = o(when(isNotNil, (array) => output.push(...array)), getArray0fGroups(privileges.routes));
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
export default function(routes, groupsHeritage) {
	privileges = { routes, groupsHeritage };
}
