import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { MenuAppBar } from './components/MenuAppBar';
import { NotificationReduxConnect } from './containers/NotificationReduxConnect';
import { MyThemeProvider } from './containers/ThemeProvider';
import { HomePage } from './Pages/Home';
import { persistor, store } from './store';

export function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <MyThemeProvider>
                    <SnackbarProvider maxSnack={3}>
                        <NotificationReduxConnect />
                        <MenuAppBar />
                        <HomePage />
                    </SnackbarProvider>
                </MyThemeProvider>
            </PersistGate>
        </Provider>
    );
}
