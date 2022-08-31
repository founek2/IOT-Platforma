import { mergeDeepRight, mergeRight, prop, uniqBy } from 'ramda';
import React from 'react';

export interface AllowedGroup {
    text: string;
    name: string;
}

export interface AllowedGroups {
    [groupName: string]: { allowedGroups: AllowedGroup[] };
}

export interface Route {
    path: string;
    Component?: React.LazyExoticComponent<() => JSX.Element>;
    name?: string;
    Icon?: React.ReactNode;
}

export interface RouteWithComponent {
    path: string;
    Component: React.LazyExoticComponent<() => JSX.Element>;
    name?: string;
    Icon?: React.ReactNode;
}

export interface RouteMenu {
    path: string;
    name: string;
    Icon: React.ReactNode;
}

export interface AllowedRoutes {
    [groupName: string]: { routes: Route[] };
}

export interface Privileges {
    [groupName: string]: { routes: Route[]; allowedGroups: AllowedGroup[] };
}

let privileges: Privileges;

export function getMenuPaths(groups: string[]): RouteMenu[] {
    const allowedRoutes = groups
        .map((group) => privileges[group].routes)
        .flat()
        .filter((r) => r.name && r.Icon);

    return uniqBy(prop('path'), allowedRoutes) as RouteMenu[];
}

export function getPathsWithComp(groups: string[]): RouteWithComponent[] {
    console.log('privileges', privileges, groups);
    const allowedRoutes = groups
        .map((group) => privileges[group].routes)
        .flat()
        .filter((r) => Boolean(r.Component));
    return uniqBy(prop('path'), allowedRoutes) as RouteWithComponent[];
}

export function getAllowedGroups(groups: string[]) {
    const allowedGroups = groups.map((group) => privileges[group].allowedGroups).flat();

    return uniqBy(prop('name'), allowedGroups);
}

/**
 * format - {groupName: [{path: /login, component}]}
 */
export default function (routes: AllowedRoutes, allowedGroups: AllowedGroups) {
    privileges = mergeDeepRight(routes, allowedGroups) as Privileges;
}
