import { createSlice } from '@reduxjs/toolkit';
import initialState from 'common/lib/fieldDescriptors';
import { FieldDescriptors } from 'framework-ui/lib/types';

// Define a type for the slice state
export type FieldDescriptsState = FieldDescriptors;

// Define the initial state using that type

export const fieldDescriptorsSlice = createSlice({
    name: 'fieldDescriptors',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState: initialState as FieldDescriptors,
    reducers: {},
});

export const fieldDescriptorsReducerActions = fieldDescriptorsSlice.actions;

export default fieldDescriptorsSlice.reducer;
