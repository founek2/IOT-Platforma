import CircularProgress from '@mui/material/CircularProgress';
import { SnackbarProvider } from 'notistack';
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Router, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { MenuAppBar } from './components/MenuAppBar';
import { NotificationReduxConnect } from './containers/NotificationReduxConnect';
import MyRoutes from './containers/Routes';
import { MyThemeProvider } from './containers/ThemeProvider';
import { persistor, store } from './store';

function App() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <MyThemeProvider>
                    <SnackbarProvider maxSnack={3}>
                        <NotificationReduxConnect />
                        <BrowserRouter>
                            <MenuAppBar />
                            <Suspense fallback={<CircularProgress />}>
                                <MyRoutes />
                            </Suspense>
                        </BrowserRouter>
                    </SnackbarProvider>
                </MyThemeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
