import BuildIcon from '@material-ui/icons/Build'
import DevicesIcon from '@material-ui/icons/DevicesOther'
import privilegesFactory from 'framework-ui/src/privileges'
import { lazy } from 'react'

export const groupsHeritage = {
     root: ['user', 'userAdmin', 'deviceAdmin']
}

const DeviceControll = lazy(() => import('../Pages/DeviceControll'))

const UserManagement = lazy(() => import('../Pages/UserManagement'))

const Devices = lazy(() => import('../Pages/Devices'))

export const routes = {
     user: {
          routes: [
               { path: '/deviceControll', Component: DeviceControll, name: 'deviceControll', Icon: BuildIcon },
               { path: '/devices', Component: Devices, name: 'devices', Icon: DevicesIcon }
          ]
     },
     userAdmin: {
          routes: [{ path: '/userManagement', Component: UserManagement, name: 'userManagement', Icon: BuildIcon }],
          allowedGroups: [{ name: 'user', text: 'Uživatel' }, { name: 'deviceAdmin', text: 'správce zařízení' }]
     },
     deviceAdmin: {},
     root: {}
}

privilegesFactory(routes, groupsHeritage)
