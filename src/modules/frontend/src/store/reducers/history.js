import { handleActions } from 'redux-actions';
import { historyReducers as reducers } from 'framework-ui/src/redux/reducers/history';

const historyReducers = {
	...reducers
};

export default handleActions(historyReducers, {});