import React, { Component, Suspense, lazy } from 'react'
import { createBrowserHistory } from 'history'
import { Router as RouterReact, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import Sensors from '../Pages/Sensors'
import RegisterUser from '../Pages/RegisterUser'
import { bindActionCreators } from 'redux'
import { map } from 'ramda'
import { getPathsWithComp } from 'framework-ui/lib/privileges'

import { getUserPresence, getGroups } from 'framework-ui/lib/utils/getters'
import { updateHistory, setHistory } from 'framework-ui/lib/redux/actions/history'
import { updateTmpData } from 'framework-ui/lib/redux/actions/tmpData'
import Loader from 'framework-ui/lib/Components/Loader'
import parseQuery from 'framework-ui/lib/utils/parseQuery'
import { hydrateState } from 'framework-ui/lib/redux/actions'
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

        const lastHistory = localStorage.getItem("history")
        if (lastHistory)
            history.push(
                JSON.parse(lastHistory)
            )

        history.listen(({ key, state, ...rest }, action) => {
            const { updateHistoryAction, updateTmpDataAction } = this.props

            const update = rest
            rest.query = parseQuery(rest.search)

            updateHistoryAction(update)
            updateTmpDataAction({ dialog: {} })

            localStorage.setItem("history", JSON.stringify(rest))
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
                <Layout history={history} />
                <Suspense fallback={<Loader open={true} />}>
                    <Switch>
                        <Route path="/deviceControl/:deviceId" component={ControlHistoryLazy} />

                        {additionRoutes}
                        <Route
                            path="/registerUser"
                            component={RegisterUser}
                        />

                        <Route path="/sensor/:deviceId" component={SensorHistoryLazy} />
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
