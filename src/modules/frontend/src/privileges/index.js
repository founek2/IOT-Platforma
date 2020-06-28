import BuildIcon from '@material-ui/icons/Build'
import DevicesIcon from '@material-ui/icons/DevicesOther'
import initPrivileges from 'framework-ui/src/privileges'
import { lazy } from 'react'

import groupsHeritage from './groupsHeritage'

// TODO lazyload is not working - no idea why :/
const DeviceControl = lazy(() => import('../Pages/DeviceControl'))

const UserManagement = lazy(() => import('../Pages/UserManagement'))

const Devices = lazy(() => import('../Pages/Devices'))

export const routes = {
     user: {
          routes: [
               { path: '/deviceControl', Component: DeviceControl, name: 'deviceControl', Icon: BuildIcon },
               { path: '/devices', Component: Devices, name: 'devices', Icon: DevicesIcon }
          ]
     },
     admin: {
          routes: [{ path: '/userManagement', Component: UserManagement, name: 'userManagement', Icon: BuildIcon }],
          allowedGroups: [{ name: 'user', text: 'Uživatel' }, { name: 'admin', text: 'správce' }]
     },
     root: {}
}

initPrivileges(routes, groupsHeritage)
