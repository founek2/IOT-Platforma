import * as formsDataActions from './formsData.js'
import { getItem, setItem, removeItem } from '../../storage'
import { actionTypes } from '../../constants/redux'
import { infoLog, warningLog } from '../../Logger'
import { STATE_DEHYDRATED } from '../../constants/redux'
import { clone } from 'ramda'

import parseJwtToken from '../../utils/parseJwtToken'

export function dehydrateState() {
     return function(dispatch, getState) {
          warningLog(STATE_DEHYDRATED)

          const { formsData, application } = clone(getState())
          delete application.notifications
          delete formsData.registeredFields

          // TODO přidal callback na úpravu statu před dehydratací
          if (application.sensors)  delete application.sensors

          setItem(STATE_DEHYDRATED, JSON.stringify({ formsData, application, dehydrationTime: new Date() }))
     }
}

export function hydrateState() {
     return function(dispatch, getState) {
          const hydratedState = getItem(STATE_DEHYDRATED)

          if (hydratedState) {
               const state = JSON.parse(hydratedState)

               if (state.application.user && state.application.user.token) {
				const tokenParsed = parseJwtToken(state.application.user.token)
				console.log(tokenParsed.exp, (new Date().getTime() + 1) / 1000)
				if (tokenParsed.exp < (new Date().getTime() + 1) / 1000){
					infoLog('Token expired')
					removeItem(STATE_DEHYDRATED);
					return;
				} 
               }
               delete state.dehydrationTime
               dispatch({
                    type: actionTypes.HYDRATE_STATE,
                    payload: state
               })

               return state;
          } else {
               infoLog('Nothing to hydrate')
          }
          return null;
     }
}

export { formsDataActions }
