import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';

// Define a type for the slice state
export type Notification = {
    message: SnackbarMessage;
    options: OptionsObject & { key: SnackbarKey };
};
export type NotificationsState = Notification[];
export type NotificationCreate = {
    message: SnackbarMessage;
    options?: Omit<Notification['options'], 'key'>;
};

// Define the initial state using that type
const initialState: NotificationsState = [];

export const notificationsSlice = createSlice({
    name: 'notifications',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set: (state, action: PayloadAction<NotificationsState>) => {
            return action.payload;
        },
        remove: (state, action: PayloadAction<SnackbarKey>) => {
            return state.filter((notification) => notification.options.key != action.payload);
        },
        add: (state, action: PayloadAction<NotificationCreate>) => {
            state.push({
                message: action.payload.message,
                options: {
                    ...(action.payload.options as any),
                    key: new Date().getTime(),
                },
            });
        },
    },
});

export const notificationActions = notificationsSlice.actions;

export default notificationsSlice.reducer;
