import { combineReducers } from 'redux';
import devices from './deviceSlice.js';
import things from './thingSlice.js';
import setting from './setting.js';
import locations from './locationSlice.js';

export default combineReducers({
    devices,
    things,
    setting,
    locations,
});
