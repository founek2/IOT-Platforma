import React, { Fragment, Component, Suspense } from 'react'
import createHistory from 'history/createBrowserHistory'
import { Router as RouterReact, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import Sensors from '../Pages/Sensors'
import SensorDetail from '../Pages/SensorDetail'
import RegisterUser from '../Pages/RegisterUser'
import { bindActionCreators } from 'redux'
import { isNotEmpty } from 'ramda-extension'
import { head, map, is } from 'ramda'
import { getPathsWithComp } from 'framework-ui/src/privileges'

import { getHistory, getUserPresence, getGroups, getToken } from 'framework-ui/src/utils/getters'
import { hydrateState } from 'framework-ui/src/redux/actions'
import { updateHistory, setHistory } from 'framework-ui/src/redux/actions/history'
import { updateTmpData } from 'framework-ui/src/redux/actions/tmpData'
import objectDiff from 'framework-ui/src/utils/objectDiff'
import Loader from 'framework-ui/src/Components/Loader'
import parseQuery from 'framework-ui/src/utils/parseQuery'
import webSocket from '../webSocket'
import LoginCallbacks from 'framework-ui/src/callbacks/login'
import LogoutCallbacks from 'framework-ui/src/callbacks/logout'

import '../privileges' // init

const history = createHistory()

const defLocation = history.location

function createRoute({ path, Component }) {
     return <Route path={path} key={path} render={props => <Component {...props} />} />
}

class Router extends Component {
     constructor(props) {
          super(props)

          const state = this.props.hydrateStateAction()
          if (state) {
               webSocket.init(getToken(state))
          } else webSocket.init()

          LoginCallbacks.register((token) => webSocket.init(token))
          LogoutCallbacks.register(() => webSocket.init())

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
                    <Fragment>
                         <Route component={Layout} />
                         <Suspense fallback={<Loader open={true} />}>
                              <Switch>
                                   {additionRoutes}
                                   <Route
                                        path="/registerUser"
                                        component={RegisterUser}
                                   />
                                    <Route path="/sensor/:deviceId" component={SensorDetail} />
                                   <Route path="/" component={Sensors} />
                              </Switch>
                         </Suspense>
                    </Fragment>
               </RouterReact>
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
               hydrateStateAction: hydrateState,
               updateHistoryAction: updateHistory,
               setHistoryAction: setHistory,
               updateTmpDataAction: updateTmpData,

          },
          dispatch
     )
})
export default connect(
     _mapStateToProps,
     _mapActionsToProps
)(Router)
