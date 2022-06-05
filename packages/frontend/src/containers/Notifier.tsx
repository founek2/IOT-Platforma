import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { notificationsActions } from 'framework-ui/src/redux/actions/application/notifications';
import { NotificationVariant } from 'framework-ui/src/types';

type NotifyKey = number;

interface notification {
    key: NotifyKey;
    message: string;
    options: any;
    dismissed: boolean;
    variant?: NotificationVariant;
    onClose: any;
    duration?: number;
}
let displayed: NotifyKey[] = [];

const Notifier = () => {
    const dispatch = useDispatch();
    const notifications = useSelector<any, notification[]>((store) => store.application.notifications || []);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const storeDisplayed = (id: NotifyKey) => {
        displayed = [...displayed, id];
    };

    const removeDisplayed = (id: NotifyKey) => {
        displayed = [...displayed.filter((key) => id !== key)];
    };

    React.useEffect(() => {
        notifications.forEach(({ key, message, variant, dismissed = false, onClose, duration = 3000 }) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key);
                return;
            }

            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return;

            // display snackbar using notistack
            enqueueSnackbar(message, {
                key,
                variant,
                autoHideDuration: duration,
                onClose: (event, reason, myKey) => {
                    if (onClose) {
                        onClose(event, reason, myKey);
                    }
                },
                onExited: (event, myKey) => {
                    // remove this snackbar from redux store
                    dispatch(notificationsActions.remove(myKey as number));
                    removeDisplayed(myKey as number);
                },
            });

            // keep track of snackbars that we've displayed
            storeDisplayed(key);
        });
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

    return null;
};

export default Notifier;
