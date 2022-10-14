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
    Icon?: any;
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
    Icon: any;
}

export interface AllowedRoutes {
    [groupName: string]: { routes: Route[] };
}

export interface Privileges {
    [groupName: string]: { routes: Route[]; allowedGroups: AllowedGroup[] };
}

export class PrivilegesContainer {
    privileges: Privileges;
    constructor(routes: AllowedRoutes, allowedGroups: AllowedGroups) {
        this.privileges = mergeDeepRight(routes, allowedGroups);
    }
    getMenuPaths = (groups: string[]): RouteMenu[] => {
        const allowedRoutes = groups
            .map((group) => this.privileges[group].routes)
            .flat()
            .filter((r) => r.name && r.Icon);

        return uniqBy(prop('path'), allowedRoutes) as RouteMenu[];
    };

    getPathsWithComp = (groups: string[]): RouteWithComponent[] => {
        const allowedRoutes = groups
            .map((group) => this.privileges[group].routes)
            .flat()
            .filter((r) => Boolean(r.Component));
        return uniqBy(prop('path'), allowedRoutes) as RouteWithComponent[];
    };

    getAllowedGroups = (groups: string[]) => {
        const allowedGroups = groups.map((group) => this.privileges[group].allowedGroups).flat();

        return uniqBy(prop('name'), allowedGroups);
    };
}
