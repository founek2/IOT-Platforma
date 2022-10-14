import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CloudIcon from '@mui/icons-material/Cloud';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import PeopleIcon from '@mui/icons-material/People';
import { AllowedRoutes, PrivilegesContainer } from 'framework-ui/src/privileges';
import { lazy } from 'react';

import { allowedGroups } from 'common/src/constants/privileges';
import { append } from 'ramda';

const UserManagement = lazy(() => import(/* webpackChunkName: 'UserManagement' */ '../Pages/UserManagement'));

const DeviceManagement = lazy(() => import(/* webpackChunkName: 'DeviceManagement' */ '../Pages/DeviceManagement'));

const DevicesLazy = lazy(() => import(/* webpackChunkName: 'Devices' */ '../Pages/Devices'));

// const EditNotifyFormLazy = lazy(() => import(/* webpackChunkName: 'EditNotifyForm' */ '../Pages/EditNotifyForm'));

// const ProfileLazy = lazy(() => import(/* webpackChunkName: 'Profile' */ '../Pages/Profile'));

const userRoutes = [
    {
        // path: ['/devices/:building/:room', '/devices/:building', '/devices'],
        path: '/devices/:building/:room',
        Component: DevicesLazy,
    },
    {
        path: '/devices/:building',
        Component: DevicesLazy,
    },
    {
        path: '/devices',
        Component: DevicesLazy,
        name: 'deviceControl',
        Icon: CloudIcon,
    },
    // {
    //     path: '/profile/*',
    //     Component: ProfileLazy,
    // },
    { path: '/deviceManagement', Component: DeviceManagement, name: 'devices', Icon: DevicesOtherIcon },
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
