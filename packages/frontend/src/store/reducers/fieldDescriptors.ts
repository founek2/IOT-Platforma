import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAccessToken } from 'common/lib/models/interface/userInterface';
import { append, filter, map, mergeLeft, propEq, when } from 'ramda';
import { fieldDescriptors } from 'framework-ui/lib/types';
import initialState from 'common/lib/fieldDescriptors';

// Define a type for the slice state
export type FieldDescriptsState = fieldDescriptors;

// Define the initial state using that type

export const fieldDescriptorsSlice = createSlice({
    name: 'fieldDescriptors',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {},
});

export const fieldDescriptorsReducerActions = fieldDescriptorsSlice.actions;

export default fieldDescriptorsSlice.reducer;
