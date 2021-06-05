import React, { useEffect, Fragment, useState } from 'react';
import { Provider } from 'react-redux';
import store from '../store/store';
import withTheme from './withTheme';
import WebSocket from './WebSocket';
import { registerFunctions } from 'framework-ui/lib/validations/validationFactory';
import * as fns from '../validations/customFn';
import * as serviceWorker from '../serviceWorker';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { SnackbarProvider } from 'notistack';

import { init as initFirebase } from '../firebase';
import '../privileges'; // init
import Notifier from './Notifier';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { getItem, removeItem } from 'framework-ui/lib/storage';
import { STATE_DEHYDRATED } from 'framework-ui/lib/constants/redux';
registerFunctions(fns); // register custom validation functions

function handleError() {
    if (getItem(STATE_DEHYDRATED)) {
        removeItem(STATE_DEHYDRATED);
        removeItem('history');
        document.location.reload(true);
    }
}

let place_holder = () => console.log('nothing to install');
function Root({ component }) {
    const [newVersion, setNewVersion] = useState(false);
    const [forceInstall, setForceInstall] = useState(() => place_holder);

    useEffect(() => {
        const config = {
            onUpdate: function (installingWorker) {
                // new version available
                setNewVersion(true);
                setForceInstall(() => () => {
                    installingWorker.postMessage({ action: 'skipWaiting' });
                    setNewVersion(false);
                });
            },
        };
        serviceWorker.register(config);
        initFirebase();
    }, []);

    const Component = component;
    return (
        <ErrorBoundary onError={() => handleError()}>
            <Provider store={store}>
                <SnackbarProvider
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                >
                    <WebSocket>
                        <Component />
                        <Notifier />
                    </WebSocket>
                </SnackbarProvider>
            </Provider>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={newVersion}
                message="K dispozici je nová verze"
                action={
                    <Button color="secondary" size="small" onClick={forceInstall}>
                        aktualizovat
                    </Button>
                }
            />
        </ErrorBoundary>
    );
}

export default withTheme(Root);
