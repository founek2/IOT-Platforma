import { combineReducers } from 'redux';
import devices from './deviceSlice';
import things from './thingSlice';
import setting from './setting';
import locations from './locationSlice';

export default combineReducers({
    devices,
    things,
    setting,
    locations,
});
