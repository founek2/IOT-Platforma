import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAccessToken } from 'common/src/models/interface/userInterface';
import { append, filter, map, mergeLeft, propEq, when } from 'ramda';

// Define a type for the slice state
export interface AccessTokensState {
    data: IAccessToken[];
    lastFetch?: Date;
    lastUpdate?: Date;
}

// Define the initial state using that type
const initialState: AccessTokensState = {
    data: [],
};

export const accessTokensSlice = createSlice({
    name: 'accessTokens',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        add: (state, action: PayloadAction<IAccessToken>) => {
            const data = append(action.payload, state.data);
            return { data, lastFetch: state.lastFetch, lastUpdate: new Date() };
        },
        set: (state, action: PayloadAction<IAccessToken[]>) => {
            const date = new Date();
            return { data: action.payload, lastFetch: date, lastUpdate: date };
        },
        toDefault: () => {
            return initialState;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        remove: ({ data, lastFetch }, action: PayloadAction<IAccessToken['_id']>) => {
            return {
                lastFetch: lastFetch,
                lastUpdate: new Date(),
                data: filter(({ _id }) => _id !== action.payload, data),
            };
        },
        update: ({ data, lastFetch }, action: PayloadAction<IAccessToken>) => {
            const { _id } = action.payload;
            // @ts-ignore
            const findAndUpdate: any = when(propEq('_id', _id), mergeLeft(action.payload));
            return {
                data: map(findAndUpdate, data),
                lastFetch,
                lastUpdate: new Date(),
            };
        },
    },
});

export const accessTokensReducerActions = accessTokensSlice.actions;

export default accessTokensSlice.reducer;
