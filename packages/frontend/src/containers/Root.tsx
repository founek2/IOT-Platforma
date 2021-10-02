import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { STATE_DEHYDRATED } from 'framework-ui/lib/constants/redux';
import { getItem, removeItem } from 'framework-ui/lib/storage';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { init as initFirebase } from '../firebase';
import '../privileges'; // init
import * as serviceWorker from '../serviceWorkerRegistration';
import store from '../store/store';
import Notifier from './Notifier';
import WebSocket from './WebSocket';
import withTheme from './withTheme';

// registerFunctions(fns); // register custom validation functions

function handleError() {
    if (getItem(STATE_DEHYDRATED)) {
        removeItem(STATE_DEHYDRATED);
        removeItem('history');
        document.location.reload(true);
    }
}

let place_holder = () => console.log('nothing to install');
function Root({ component }: { component: React.FunctionComponent }) {
    const [newVersion, setNewVersion] = useState(false);
    const [forceInstall, setForceInstall] = useState(() => place_holder);

    useEffect(() => {
        const config = {
            onUpdate: function (installingWorker: any) {
                // new version available
                setNewVersion(true);
                setForceInstall(() => () => {
                    installingWorker.postMessage({ action: 'SKIP_WAITING' });
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
