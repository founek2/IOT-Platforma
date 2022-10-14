import { combineReducers } from 'redux';
import authorization from './authorizationSlice';
import preferences from './preferencesSlice';
import devices from './devicesSlice';
import things from './thingsSlice';

export default combineReducers({
    authorization,
    preferences,
    devices,
    things,
});
