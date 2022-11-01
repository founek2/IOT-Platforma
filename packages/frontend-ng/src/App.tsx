import CircularProgress from '@mui/material/CircularProgress';
import { SnackbarProvider } from 'notistack';
import { string } from 'prop-types';
import React, { Suspense, useCallback, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Router, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Background } from './components/Background';
import { MenuAppBar } from './components/MenuAppBar';
import { NotificationReduxConnect } from './containers/NotificationReduxConnect';
import MyRoutes from './containers/Routes';
import { MyThemeProvider } from './containers/ThemeProvider';
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
                            </AppBarContext.Provider>
                        </BrowserRouter>
                    </SnackbarProvider>
                </MyThemeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
