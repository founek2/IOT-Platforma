import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import store from '../store/store'
import withTheme from './withTheme'
import Notifications from 'framework-ui/src/Components/Notifications';
import WebSocket from './WebSocket'
import {registerFunctions} from 'framework-ui/src/validations/validationFactory'
import * as fns from '../validations/customFn'

import '../privileges' // init
console.log("registr", fns)
registerFunctions(fns);  // register custom validation functions

function Root({ component, hydrateStateAction }) {
     const Component = component
     console.log("root")
     return (
          <Provider store={store}>
               <WebSocket >
                    <Component />
                    <Notifications maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
               </WebSocket>
          </Provider>
     )
}


export default withTheme(Root)
