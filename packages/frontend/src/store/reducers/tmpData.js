import { handleActions } from 'redux-actions';
import { tmpDataReducers as reducers } from 'framework-ui/lib/redux/reducers/tmpData';

const tmpDataReducers = {
    ...reducers
};

export default handleActions(tmpDataReducers, {});