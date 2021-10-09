import Loader from 'framework-ui/lib/Components/Loader';
import { getPathsWithComp } from 'framework-ui/lib/privileges';
import { historyActions } from 'framework-ui/lib/redux/actions/history';
import { historyReducerActions } from 'framework-ui/lib/redux/reducers/history';
import { isUserLoggerIn } from 'framework-ui/lib/utils/getters';
import parseQuery from 'framework-ui/lib/utils/parseQuery';
import { createBrowserHistory } from 'history';
import { map } from 'ramda';
import React, { Suspense, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Layout from '../components/Layout';
import '../firebase'; // init
import { Authorization } from '../Pages/Authorization';
import Main from '../Pages/Main';
import RegisterUser from '../Pages/RegisterUser';
import { getGroups } from '../utils/getters';

const history = createBrowserHistory();

const defLocation = history.location;

function createRoute({ path, Component }: { path: string; Component: any }) {
    return <Route path={path} key={path} component={Component} />;
}

interface RouterProps {
    userPresence: boolean;
    userGroups: String[];
    setHistoryAction: any;
    updateTmpDataAction: any;
    hydrateStateAction: any;
}

function Router({ userPresence, userGroups }: RouterProps) {
    const dispatch = useDispatch();
    useEffect(() => {
        // this.props.hydrateStateAction(); // must be done before rendering

        dispatch(
            historyActions.set({
                pathname: defLocation.pathname,
                hash: defLocation.hash,
                search: defLocation.search,
                query: parseQuery(defLocation.search),
            })
        );

        const lastHistory = localStorage.getItem('history');

        if (lastHistory && history.location.pathname === '/') history.push(JSON.parse(lastHistory));

        history.listen(({ key, state, ...rest }, action) => {
            dispatch(
                historyReducerActions.set({
                    ...rest,
                    query: parseQuery(rest.search),
                })
            );

            // updateTmpDataAction({ dialog: {} });

            localStorage.setItem('history', JSON.stringify(rest));
        });
    }, [dispatch]);

    let additionRoutes = null;
    if (userPresence) {
        const paths = getPathsWithComp(userGroups);
        additionRoutes = map(createRoute, paths);
    }

    return (
        <BrowserRouter>
            <Layout />
            <Suspense fallback={<Loader open center />}>
                <Switch>
                    {/* <Route path="/deviceControl/:deviceId" component={ControlHistoryLazy} /> */}

                    {additionRoutes}
                    <Route path="/registerUser" component={RegisterUser} />
                    {/* <Route path="/sensor/:deviceId" component={SensorHistoryLazy} /> */}
                    {/* <Route path="/device/:deviceId/thing/:nodeId/notify" component={EditNotifyFormLazy} /> */}
                    {/* <Route
                            path={[ '/devices/:building/:room', '/devices/:building', '/devices' ]}
                            component={Devices}
                        /> */}
                    <Route path="/authorization" component={Authorization} />
                    <Route path="/" component={Main} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}
const _mapStateToProps = (state: any) => ({
    userPresence: isUserLoggerIn(state),
    userGroups: getGroups(state),
});

export default connect(_mapStateToProps)(Router as any);
