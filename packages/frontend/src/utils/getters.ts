import { IThing } from 'common/src/models/interface/thing';
import { curry, o, prop } from 'ramda';
import { Device, deviceSelectors } from '../store/reducers/application/devices';
import { thingSelectors } from '../store/reducers/application/things';
import { RootState } from '../store/store';

export const getApplication = (state: RootState) => state.application;

export const getHistory = (state: RootState) => state.history;
export const getQuery = (state: RootState) => state.history.query;

export const getDevices = o((app) => deviceSelectors.selectAll(app.devices), getApplication);
export const getDevice = (deviceId: Device['_id']) => (state: RootState) =>
    deviceSelectors.selectById(getApplication(state).devices, deviceId);

export const getThingEntities = o((app) => thingSelectors.selectEntities(app.things), getApplication);
export const getThing = (thingId: IThing['_id']) => (state: RootState) =>
    thingSelectors.selectById(getApplication(state).things, thingId);
// export const getThingsForDevice = (deviceId: Device['_id']) => (state: RootState) =>
//     deviceSelectors.selectById(getApplication(state).devices, deviceId);

// export const getDevices = o(path(['devices', 'data']), getApplication);

// export const getQueryID = o(path(['query', 'id']), getHistory);
export const getQueryID = o((app) => app.query.id, getHistory);

// export const getQueryField = curry((name, state) => o(path(['query', name]), getHistory)(state));
export const getQueryField = curry((field: string, state: RootState) =>
    o((history) => history.query[field], getHistory)(state)
);

export const getUserNames = o((app) => app.userNames, getApplication);

export const getDiscovery = o((app) => app.discovery, getApplication);

export const getThingHistory = o((app) => app.thingHistory, getApplication);

export const getUser = o((app) => app.user, getApplication);

export const getRealm = o((user) => user?.realm, getUser);

export const getUsers = o((app) => app.users, getApplication);

export const getUserInfo = o((user) => user?.info, getUser);

export const getGroups = o((user) => user?.groups || [], getUser);

export const getUserId = o((user) => user._id, getUser);
