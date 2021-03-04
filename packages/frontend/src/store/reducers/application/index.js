import { combineReducers } from "redux";
import user from "framework-ui/lib/redux/reducers/application/user";
import notifications from "framework-ui/lib/redux/reducers/application/notifications";
import users from "framework-ui/lib/redux/reducers/application/users";
import devices from "./devices";
import userNames from "./userNames";
import discovery from "./discovery";

export default combineReducers({
	user,
	notifications,
	users,
	devices,
	userNames,
	discovery,
});
