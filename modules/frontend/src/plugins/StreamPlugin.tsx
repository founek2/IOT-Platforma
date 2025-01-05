import { Box, Button, Checkbox, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Dialog } from '../components/Dialog';
//import { Platform } from 'integration';
import { generateDeviceId } from '../utils/generateDeviceId';
import { getCurrentUser } from '../selectors/getters';
import { useAppDispatch, useAppSelector } from '../hooks';
import { pluginsReducerActions } from '../store/slices/pluginsSlice';

export function Setting() {
    const enabled = useAppSelector((state) => state.plugins.stream.enabled);
    const dispatch = useAppDispatch();

    function enablePlugin() {
        dispatch(pluginsReducerActions.updatePlugin({ plugin: 'stream', state: { enabled: true } }));
    }

    function disablePlugin() {
        dispatch(pluginsReducerActions.updatePlugin({ plugin: 'stream', state: { enabled: false } }));
    }

    return (
        <Box>
            <Button onClick={enabled ? disablePlugin : enablePlugin}>{enabled ? 'Vypnout' : 'Zapnout'}</Button>
        </Box>
    );
}

export function Root() {
    const [open, setOpen] = useState(false);
    const currentUser = useAppSelector(getCurrentUser);

    useEffect(() => {
        if (!currentUser) return;

        //new Platform(deviceId, currentUser.info.userName, 'Tablet');
    }, []);

    return <Dialog open={open} onClose={() => setOpen(false)} title="Přejete si zapnout plugin" />;
}
