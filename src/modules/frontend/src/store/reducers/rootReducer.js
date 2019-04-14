import { combineReducers } from 'redux'
import fieldDescriptors from './fieldDescriptors'
import hydrateReducer from 'framework-ui/src/redux/reducers/rootReducer'
import tmpData from './tmpData'
import formsData from './formsData'
import application from './application'
import history from './history'
import initState from '../initState'
import { warningLog } from 'framework-ui/src/Logger'
import { STATE_DEHYDRATED, actionTypes } from 'framework-ui/src/constants/redux'
import { removeItems } from 'framework-ui/src/storage'
import {merge} from 'ramda';

const appReducer = combineReducers({
     application,
     formsData,
     fieldDescriptors,
     tmpData,
     history
})

const rootReducer = (state, action) => {

     if (action.type === actionTypes.RESET_TO_DEFAULT) {
		warningLog('RESET_TO_DEFAULT')
		const init = initState();
		removeItems([STATE_DEHYDRATED])
		delete init.application.sensors;
		delete init.fieldDescriptors;
          state = merge(state, init)
     }
     return hydrateReducer(appReducer)(state, action)
}

export default rootReducer
