import Loader from 'framework-ui/src/Components/Loader';
import { getPathsWithComp } from 'framework-ui/src/privileges';
import { historyActions } from 'framework-ui/src/redux/actions/history';
import { historyReducerActions } from 'framework-ui/src/redux/reducers/history';
import { isUserLoggerIn } from 'framework-ui/src/utils/getters';
import parseQuery from 'framework-ui/src/utils/parseQuery';
import { createBrowserHistory } from 'history';
import { map } from 'ramda';
import React, { Suspense, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Route, Router as RouterReact, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import '../firebase'; // init
import { Authorization } from '../Pages/Authorization';
import Main from '../Pages/Main';
import RegisterUser from '../Pages/RegisterUser';
import { getGroups } from '../utils/getters';
import { CustomRouter } from './CustomRouter';

const history = createBrowserHistory();

const defLocation = history.location;

function createRoute({ path, Component }: { path: string; Component: any }) {
    return <Route path={path} key={path} element={<Component />} />;
}

interface RouterProps {
    userPresence: boolean;
    userGroups: String[];
    setHistoryAction: any;
    updateTmpDataAction: any;
    hydrateStateAction: any;
}

function Router({ userPresence, userGroups }: RouterProps) {
    let additionRoutes = null;
    if (userPresence) {
        const paths = getPathsWithComp(userGroups);
        additionRoutes = map(createRoute, paths);
    }

    return (
        <CustomRouter history={history}>
            <Layout>
                <Suspense fallback={<Loader open center />}>
                    <Routes>
                        {/* <Route path="/deviceControl/:deviceId" component={ControlHistoryLazy} /> */}

                        {additionRoutes}
                        <Route path="/registerUser" element={<RegisterUser />} />
                        {/* <Route path="/sensor/:deviceId" component={SensorHistoryLazy} /> */}
                        {/* <Route path="/device/:deviceId/thing/:nodeId/notify" component={EditNotifyFormLazy} /> */}
                        {/* <Route
                            path={[ '/devices/:building/:room', '/devices/:building', '/devices' ]}
                            component={Devices}
                        /> */}
                        <Route path="/authorization" element={<Authorization />} />
                        <Route path="/" element={<Main />} />
                    </Routes>
                </Suspense>
            </Layout>
        </CustomRouter>
    );
}
const _mapStateToProps = (state: any) => ({
    userPresence: isUserLoggerIn(state),
    userGroups: getGroups(state),
});

export default connect(_mapStateToProps)(Router as any);
