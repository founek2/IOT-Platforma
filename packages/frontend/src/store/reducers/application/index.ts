import authorization from 'framework-ui/src/redux/reducers/application/authorization';
import notifications from 'framework-ui/src/redux/reducers/application/notifications';
import { combineReducers } from 'redux';
import devices from './devices';
import discovery from './discovery';
import thingHistory from './thingHistory';
import things from './things';
import user from './user';
import userNames from './userNames';
import users from './users';

export default combineReducers({
    user,
    authorization,
    notifications,
    users,
    devices,
    things,
    userNames,
    discovery,
    thingHistory,
});
