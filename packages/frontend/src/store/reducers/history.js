import { handleActions } from 'redux-actions';
import { historyReducers as reducers } from 'framework-ui/lib/redux/reducers/history';

const historyReducers = {
    ...reducers
};

export default handleActions(historyReducers, {});