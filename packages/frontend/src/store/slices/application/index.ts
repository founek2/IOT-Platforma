import { combineReducers } from 'redux';
import authorization from './authorizationSlice';
import devices from './devicesSlice';
import things from './thingsSlice';
import discovery from './discoverySlice';
import users from './usersSlice';

export default combineReducers({
    authorization,
    devices,
    discovery,
    things,
    users,
});
