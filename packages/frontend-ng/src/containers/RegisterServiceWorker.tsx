import { Button, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import * as serviceWorker from '../serviceWorkerRegistration';

let place_holder = () => console.log('nothing to install');
export function RegisterServiceWorker() {
    const [newVersion, setNewVersion] = useState(false);
    const [forceInstall, setForceInstall] = useState(() => place_holder);

    useEffect(() => {
        const config = {
            onUpdate: function (registration: ServiceWorkerRegistration) {
                // new version available
                setNewVersion(true);
                setForceInstall(() => () => {
                    const installingWorker = registration.waiting;
                    installingWorker?.postMessage({ type: 'SKIP_WAITING' });
                    setNewVersion(false);
                    window.location.reload();
                });
            },
        };
        serviceWorker.register(config);
    });

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={newVersion}
            message="K dispozici je nová verze"
            action={
                <Button size="small" onClick={forceInstall}>
                    aktualizovat
                </Button>
            }
        />
    );
}
