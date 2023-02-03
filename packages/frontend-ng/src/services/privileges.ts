import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CloudIcon from '@mui/icons-material/Cloud';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import PeopleIcon from '@mui/icons-material/People';
import { AllowedRoutes, PrivilegesContainer, Route, RouteMenu } from 'common/src/privileges';
import { lazy } from 'react';

import { allowedGroups } from 'common/src/constants/privileges';
import { append } from '../utils/ramda';

const UserManagement = lazy(() => import(/* webpackChunkName: 'UserManagement' */ '../Pages/UserManagement'));

const DeviceManagementLazy = lazy(() => import(/* webpackChunkName: 'DeviceManagement' */ '../Pages/DeviceManagement'));

const LocationsLazy = lazy(() => import(/* webpackChunkName: 'Locations' */ '../Pages/Locations'));

const LocationsManagementLazy = lazy(
    () => import(/* webpackChunkName: 'LocationsManagement' */ '../Pages/LocationsManagement')
);

const RoomLazy = lazy(() => import(/* webpackChunkName: 'Room' */ '../Pages/Room'));

// const EditNotifyFormLazy = lazy(() => import(/* webpackChunkName: 'EditNotifyForm' */ '../Pages/EditNotifyForm'));

// const ProfileLazy = lazy(() => import(/* webpackChunkName: 'Profile' */ '../Pages/Profile'));

const userRoutes: Route[] = [
    {
        path: '/building/:building/room/:room',
        name: 'devices',
        Component: RoomLazy,
    },
    {
        path: '/building/:building',
        name: 'devices',
        Component: LocationsLazy,
    },
    {
        path: '/building',
        Component: LocationsLazy,
        name: 'devices',
        Icon: CloudIcon,
    },
    // {
    //     path: '/profile/*',
    //     Component: ProfileLazy,
    // },
    { path: '/management/building', Component: LocationsManagementLazy, name: 'deviceControl', Icon: DevicesOtherIcon },
    { path: '/management/building/:building', Component: LocationsManagementLazy, name: 'deviceControl' },
    { path: '/management/building/:building/room/:room', Component: DeviceManagementLazy, name: 'deviceControl' },
    // {
    //     path: '/management/building/:building/room/:room',
    //     Component: RoomsLazy,
    // },
    // { path: '/device/:deviceId/thing/:nodeId/notify', Component: EditNotifyFormLazy },
];
const adminRoutes = append(
    { path: '/userManagement', Component: UserManagement, name: 'userManagement', Icon: PeopleIcon },
    userRoutes
);

export const routes: AllowedRoutes = {
    user: {
        routes: userRoutes,
    },
    admin: {
        routes: adminRoutes,
    },
    root: {
        routes: adminRoutes,
    },
    flow: {
        routes: [{ path: 'https://flow.iotdomu.cz', name: 'visualProgramming', Icon: AllInclusiveIcon }],
    },
};

export const privileges = new PrivilegesContainer(routes, allowedGroups);
