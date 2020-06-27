import React, { Component, Suspense, lazy } from 'react'
import { createBrowserHistory } from 'history'
import { Router as RouterReact, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import Sensors from '../Pages/Sensors'
import RegisterUser from '../Pages/RegisterUser'
import { bindActionCreators } from 'redux'
import { map } from 'ramda'
import { getPathsWithComp } from 'framework-ui/src/privileges'

import { getUserPresence, getGroups } from 'framework-ui/src/utils/getters'
import { updateHistory, setHistory } from 'framework-ui/src/redux/actions/history'
import { updateTmpData } from 'framework-ui/src/redux/actions/tmpData'
import Loader from 'framework-ui/src/Components/Loader'
import parseQuery from 'framework-ui/src/utils/parseQuery'
import { hydrateState } from 'framework-ui/src/redux/actions'
import "../firebase"     // init

const history = createBrowserHistory()

const defLocation = history.location

function createRoute({ path, Component }) {
     return <Route path={path} key={path} render={props => <Component {...props} />} />
}

const SensorHistoryLazy = lazy(() => import('../Pages/SensorHistory'));
const ControlHistoryLazy = lazy(() => import('../Pages/ControlHistory'));

class Router extends Component {
     constructor(props) {
          super(props)
          this.props.hydrateStateAction() // must be done before rendering

          this.props.setHistoryAction({
               pathname: defLocation.pathname,
               hash: defLocation.hash,
               search: defLocation.search,
               query: parseQuery(defLocation.search)
          })

          history.listen(({ key, state, ...rest }, action) => {
               const { updateHistoryAction, updateTmpDataAction } = this.props

               const update = rest
               rest.query = parseQuery(rest.search)

               updateHistoryAction(update)
               updateTmpDataAction({ dialog: {} })
          })
     }
     render() {
          const { userPresence, userGroups } = this.props

          let additionRoutes = null
          if (userPresence) {
               const paths = getPathsWithComp(userGroups)
               additionRoutes = map(createRoute, paths)
          }

          return (

               <RouterReact history={history}>
                    <Suspense fallback={<Loader open={true} />}>
                         <Layout history={history} />
                         <Switch>
                              {additionRoutes}
                              <Route
                                   path="/registerUser"
                                   component={RegisterUser}
                              />
                              <Route path="/sensor/:deviceId" component={SensorHistoryLazy} />
                              <Route path="/deviceControl/:deviceId" component={ControlHistoryLazy} />
                              <Route path="/" component={Sensors} />
                         </Switch>
                    </Suspense>
               </RouterReact >

          )
     }
}
const _mapStateToProps = state => ({
     userPresence: getUserPresence(state),
     userGroups: getGroups(state)
})

const _mapActionsToProps = dispatch => ({
     ...bindActionCreators(
          {
               updateHistoryAction: updateHistory,
               setHistoryAction: setHistory,
               updateTmpDataAction: updateTmpData,
               hydrateStateAction: hydrateState,

          },
          dispatch
     )
})

export default connect(
     _mapStateToProps,
     _mapActionsToProps
)(Router)
