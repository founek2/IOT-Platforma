import React from 'react'
import { Provider } from 'react-redux'
import store from '../store/store'
import withTheme from './withTheme'
import Notifications from 'framework-ui/src/Components/Notifications';

function Root({component}) {
	const Component = component
     return (
          <Provider store={store}>
                    <Component />
                    <Notifications maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
          </Provider>
     )
}

export default withTheme(Root)
