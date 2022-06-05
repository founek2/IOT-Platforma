import { handleActions } from 'redux-actions';
import { tmpDataReducers as reducers } from 'framework-ui/src/redux/reducers/tmpData';

const tmpDataReducers = {
    ...reducers,
};

export default handleActions(tmpDataReducers, {});
