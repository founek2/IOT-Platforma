import { handleActions } from 'redux-actions';
import { formDataReducers as reducers } from 'framework-ui/lib/redux/reducers/formsData';

const formDataReducers = {
    ...reducers
};

export default handleActions(formDataReducers, {});