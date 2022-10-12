import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarKey, useSnackbar } from 'notistack';
import { notificationActions } from '../store/slices/notificationSlice';
import { getNotifications } from '../utils/getters';

export function NotificationReduxConnect() {
    const [displayed, setDisplayed] = useState<SnackbarKey[]>([]);
    const dispatch = useDispatch();
    const notifications = useSelector(getNotifications);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const storeDisplayed = (id: SnackbarKey) => {
        setDisplayed([...displayed, id]);
    };

    const removeDisplayed = (id: SnackbarKey) => {
        setDisplayed([...displayed.filter((key) => id !== key)]);
    };

    React.useEffect(() => {
        notifications.forEach(({ message, options: { key, autoHideDuration = 3000, onExited, ...props } }) => {
            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return;

            // display snackbar using notistack
            enqueueSnackbar(message, {
                key,
                autoHideDuration,
                onExited: (event, myKey) => {
                    console.log('exited');
                    // remove this snackbar from redux store
                    dispatch(notificationActions.remove(myKey));
                    // removeDisplayed(myKey);
                    if (onExited) onExited(event, myKey);
                    // closeSnackbar(key);
                },
                ...props,
            });

            // keep track of snackbars that we've displayed
            storeDisplayed(key);
        });
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

    return null;
}
