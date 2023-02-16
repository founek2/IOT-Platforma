import { combineReducers } from 'redux';
import authorization from './authorizationSlice';
import devices from './devicesSlice';
import things from './thingsSlice';
import pending from './pendingSlice';
import discovery from './discoverySlice';

export default combineReducers({
    authorization,
    devices,
    discovery,
    things,
    pending,
});
