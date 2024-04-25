import { combineReducers } from '@reduxjs/toolkit';
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
