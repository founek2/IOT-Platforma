import React from 'react';
import { Provider } from 'react-redux';
import { MenuAppBar } from './components/MenuAppBar';
import { MyThemeProvider } from './containers/ThemeProvider';
import { store } from './store';

export function App() {
    return (
        <Provider store={store}>
            <MyThemeProvider>
                <MenuAppBar />
            </MyThemeProvider>
        </Provider>
    );
}
