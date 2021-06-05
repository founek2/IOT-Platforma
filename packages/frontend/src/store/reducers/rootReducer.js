import { combineReducers } from 'redux';
import fieldDescriptors from './fieldDescriptors';
import hydrateReducer from 'framework-ui/lib/redux/reducers/rootReducer';
import tmpData from './tmpData';
import formsData from './formsData';
import application from './application';
import history from './history';
import { createState } from '../initState';
import { warningLog } from 'framework-ui/lib/logger';
import { STATE_DEHYDRATED, ActionTypes } from 'framework-ui/lib/constants/redux';
import { removeItems } from 'framework-ui/lib/storage';
import { merge } from 'ramda';

const appReducer = combineReducers({
    application,
    formsData,
    fieldDescriptors,
    tmpData,
    history,
});

const rootReducer = (state, action) => {
    if (action.type === ActionTypes.RESET_TO_DEFAULT) {
        warningLog('RESET_TO_DEFAULT');
        const init = createState();
        removeItems([STATE_DEHYDRATED]);
        delete init.application.sensors;
        delete init.fieldDescriptors;
        state = merge(state, init);
    }
    return hydrateReducer(appReducer)(state, action);
};

export default rootReducer;
