import CircularProgress from '@mui/material/CircularProgress';
import { SnackbarProvider } from 'notistack';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Background } from './components/Background';
import EditUserDialog from './components/EditUserDialog';
import { MenuAppBar } from './components/MenuAppBar';
import { NotificationReduxConnect } from './containers/NotificationReduxConnect';
import { RegisterServiceWorker } from './containers/RegisterServiceWorker';
import MyRoutes from './containers/Routes';
import { MyThemeProvider } from './containers/ThemeProvider';
import WebSocket from './containers/WebSocket';
import { AppBarContext, AppBarContextType, defaultAppBarCtx } from './hooks/useAppBarContext';
import { persistor, store } from './store';

function App() {
    const [appBarData, setAppBarData] = useState<AppBarContextType['data']>(defaultAppBarCtx.data);
    const setData = useCallback(
        (text: string, Icon?: JSX.Element) => setAppBarData([text, Icon || null]),
        [setAppBarData]
    );
    const resetData = useCallback(() => setAppBarData(defaultAppBarCtx.data), [setAppBarData]);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <MyThemeProvider>
                    <SnackbarProvider maxSnack={3}>
                        <NotificationReduxConnect />
                        <RegisterServiceWorker />
                        <BrowserRouter>
                            <AppBarContext.Provider
                                value={{ data: appBarData, setAppHeader: setData, resetAppHeader: resetData }}
                            >
                                <MenuAppBar />
                                <Background>
                                    <Suspense fallback={<CircularProgress />}>
                                        <MyRoutes />
                                    </Suspense>
                                </Background>
                                <EditUserDialog />
                            </AppBarContext.Provider>
                            <WebSocket />
                        </BrowserRouter>
                    </SnackbarProvider>
                </MyThemeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
