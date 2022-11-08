import { combineReducers } from 'redux';
import authorization from './authorizationSlice';
import devices from './devicesSlice';
import things from './thingsSlice';
import pending from './pendingSlice';

export default combineReducers({
    authorization,
    devices,
    things,
    pending,
});
