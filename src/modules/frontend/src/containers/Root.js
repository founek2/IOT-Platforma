import React, { useEffect, Fragment, useState } from 'react'
import { Provider } from 'react-redux'
import store from '../store/store'
import withTheme from './withTheme'
import Notifications from 'framework-ui/src/Components/Notifications';
import WebSocket from './WebSocket'
import { registerFunctions } from 'framework-ui/src/validations/validationFactory'
import * as fns from '../validations/customFn'
import * as serviceWorker from '../serviceWorker'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'

import '../privileges' // init
registerFunctions(fns);  // register custom validation functions

let place_holder = () => console.log("nothing to install");
function Root({ component }) {
     const [newVersion, setNewVersion] = useState(false)
     const [forceInstall, setForceInstall] = useState(() => place_holder)

     useEffect(() => {
          const config = {
               onUpdate: function (installingWorker) {  // new version available
                    setNewVersion(true)
                    setForceInstall(() => () => {
                         installingWorker.postMessage({ action: 'skipWaiting' })
                         setNewVersion(false)
                    })
               }
          }
          serviceWorker.register(config)
     }, [])

     const Component = component
     return (
          <Fragment>
               <Provider store={store}>
                    <WebSocket >
                         <Component />
                         <Notifications maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
                    </WebSocket>
               </Provider>
               <Snackbar
                    anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'center',
                    }}
                    open={newVersion}
                    message="K dispozici je nová verze"
                    action={
                         <Button color="secondary" size="small" onClick={forceInstall}>
                              nainstalovat
                         </Button>}
               />
          </Fragment>
     )
}


export default withTheme(Root)
