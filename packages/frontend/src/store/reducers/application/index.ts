import { combineReducers, AnyAction, Reducer } from 'redux';
import user from 'framework-ui/src/redux/reducers/application/user';
import notifications from 'framework-ui/src/redux/reducers/application/notifications';
import users from 'framework-ui/src/redux/reducers/application/users';
import devices from './devices';
import things from './things';
import userNames from './userNames';
import discovery from './discovery';
import thingHistory from './thingHistory';
import authorization from 'framework-ui/src/redux/reducers/application/authorization';
import { IUser } from 'common/src/models/interface/userInterface';

export default combineReducers({
    user: user as unknown as Reducer<IUser | null, AnyAction>,
    authorization,
    notifications,
    users: users as unknown as Reducer<IUser[], AnyAction>,
    devices,
    things,
    userNames,
    discovery,
    thingHistory,
});
