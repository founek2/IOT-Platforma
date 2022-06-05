import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { append, filter, not, o, propEq } from 'ramda';
import { NotificationVariant } from '../../../types';

// Define a type for the slice state
export type Notification = { key: number; message: string; variant: NotificationVariant; duration: number };
export type NotificationsState = Notification[];

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
        remove: (state, action: PayloadAction<number>) => {
            return state.filter((notification) => notification.key != action.payload);
            // return filter(o(not, propEq('key', action.payload)), state);
        },
        add: (state, action: PayloadAction<Omit<Notification, 'key'>>) => {
            const updatedState = append({ ...action.payload, key: new Date().getTime() }, state);
            return updatedState;
        },
    },
});

export const notificationsReducerActions = notificationsSlice.actions;

export default notificationsSlice.reducer;
