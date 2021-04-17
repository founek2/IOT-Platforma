import BuildIcon from '@material-ui/icons/Build';
import DevicesIcon from '@material-ui/icons/DevicesOther';
import CloudIcon from '@material-ui/icons/Cloud';
import initPrivileges from 'framework-ui/lib/privileges';
import { lazy } from 'react';

import { groupsHeritage, allowedGroups } from 'common/lib/constants/privileges';

const UserManagement = lazy(() => import('../Pages/UserManagement'));

const DeviceManagement = lazy(() => import('../Pages/DeviceManagement'));

const DevicesLazy = lazy(() => import('../Pages/Devices'));

const EditNotifyFormLazy = lazy(() => import('../Pages/EditNotifyForm'));

export const routes = {
    user: {
        routes: [
            {
                path: [ '/devices/:building/:room', '/devices/:building', '/devices' ],
                Component: DevicesLazy
            },
            { path: '/devices', name: 'deviceControl', Icon: CloudIcon },
            { path: '/deviceManagement', Component: DeviceManagement, name: 'devices', Icon: DevicesIcon },
            { path: '/device/:deviceId/thing/:nodeId/notify', Component: EditNotifyFormLazy }
        ]
    },
    admin: {
        routes: [ { path: '/userManagement', Component: UserManagement, name: 'userManagement', Icon: BuildIcon } ],
        allowedGroups: allowedGroups.admin
    },
    root: {
        allowedGroups: allowedGroups.root
    }
};

initPrivileges(routes, groupsHeritage);
