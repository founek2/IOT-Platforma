import Loader from 'framework-ui/src/Components/Loader';
import { getPathsWithComp } from 'framework-ui/src/privileges';
import { isUserLoggerIn } from 'framework-ui/src/utils/getters';
import { createBrowserHistory } from 'history';
import { map } from 'ramda';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from 'src/hooks';
import Layout from '../components/Layout';
import '../firebase'; // init
import { Authorization } from '../Pages/Authorization';
import Main from '../Pages/Main';
import RegisterUser from '../Pages/RegisterUser';
import { getGroups } from '../utils/getters';
import { CustomRouter } from './CustomRouter';

const history = createBrowserHistory();

function createRoute({ path, Component }: { path: string; Component: any }) {
    return <Route path={path} key={path} element={<Component />} />;
}

function Router() {
    const userPresence = useAppSelector(isUserLoggerIn);
    const userGroups = useAppSelector(getGroups);

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
                        <Route path="/authorization/*" element={<Authorization />} />
                        {/* <Route
                            path="/http(s?)://*"
                            ={() => {
                                window.location.href = 'https://example.com/1234';
                                return null;
                            }}
                        /> */}
                        <Route path="/*" element={<Main />} />
                    </Routes>
                </Suspense>
            </Layout>
        </CustomRouter>
    );
}

export default Router;
