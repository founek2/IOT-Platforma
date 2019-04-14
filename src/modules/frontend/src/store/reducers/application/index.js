import { combineReducers } from 'redux';
import user from 'framework-ui/src/redux/reducers/application/user';
import notifications from 'framework-ui/src/redux/reducers/application/notifications';
import users from 'framework-ui/src/redux/reducers/application/users';
import devices from './devices';

export default combineReducers({
	user,
	notifications,
	users,
	devices
});
