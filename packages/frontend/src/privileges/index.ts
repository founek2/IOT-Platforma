import BuildIcon from '@material-ui/icons/Build';
import DevicesIcon from '@material-ui/icons/DevicesOther';
import CloudIcon from '@material-ui/icons/Cloud';
import initPrivileges from 'framework-ui/src/privileges';
import { lazy } from 'react';

import { groupsHeritage, allowedGroups } from 'common/src/constants/privileges';

const UserManagement = lazy(() => import('../Pages/UserManagement'));

const DeviceManagement = lazy(() => import('../Pages/DeviceManagement'));

const DevicesLazy = lazy(() => import('../Pages/Devices'));

const EditNotifyFormLazy = lazy(() => import('../Pages/EditNotifyForm'));

const ProfileLazy = lazy(() => import('../Pages/Profile'));

export const routes = {
    user: {
        routes: [
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
            },
            {
                path: '/profile/*',
                Component: ProfileLazy,
            },
            { path: '/devices', name: 'deviceControl', Icon: CloudIcon },
            { path: '/deviceManagement', Component: DeviceManagement, name: 'devices', Icon: DevicesIcon },
            { path: '/device/:deviceId/thing/:nodeId/notify', Component: EditNotifyFormLazy },
        ],
    },
    admin: {
        routes: [{ path: '/userManagement', Component: UserManagement, name: 'userManagement', Icon: BuildIcon }],
        allowedGroups: allowedGroups.admin,
    },
    root: {
        routes: [],
        allowedGroups: allowedGroups.root,
    },
    // flow: {
    //     routers: [],
    // },
};

initPrivileges(routes, groupsHeritage);
