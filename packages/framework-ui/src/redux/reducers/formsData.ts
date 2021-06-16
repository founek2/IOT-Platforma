import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dissoc, dissocPath, merge } from 'ramda';
import getInPath from '../../utils/getInPath';
import setInPath from '../../utils/setInPath';

// Define a type for the slice state
export interface FormsDataState {
    fieldDescripts: any;
    [formName: string]: any;
}

// Define the initial state using that type
const initialState: FormsDataState = { fieldDescripts: {} };

export const formsDataSlice = createSlice({
    name: 'formsData',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setFormData: (state, action: PayloadAction<{ formName: string; data: any }>) => {
            const { formName, data } = action.payload;
            return setInPath(formName, data, state);
        },
        updateFormData: (state, action: PayloadAction<{ formName: string; data: any }>) => {
            const { formName, data } = action.payload;
            return merge(state, { [formName]: data });
        },
        removeForm: (state, action: PayloadAction<string>) => {
            return dissoc(action.payload, state);
        },
        registerField: (state, action: PayloadAction<string>) => {
            return setInPath('registeredFields.' + action.payload, { valid: true, pristine: true }, state);
        },
        unregisterField: (state, action: PayloadAction<string>) => {
            return dissocPath(['registeredFields', ...action.payload.split('.')], state);
        },
        updateRegisteredField: (state, action: PayloadAction<{ deepPath: string; value: any }>) => {
            const { deepPath, value } = action.payload;
            const fieldState = getInPath('registeredFields.' + deepPath, state);
            const newFieldState = merge(fieldState, value);
            return setInPath('registeredFields.' + deepPath, newFieldState, state);
        },
        updateRegisteredFields: (state, action: PayloadAction<any>) => {
            const fieldState = getInPath('registeredFields', state);
            const newFieldState = merge(fieldState, action.payload);
            return setInPath('registeredFields', newFieldState, state);
        },
        setFormField: (state, action: PayloadAction<{ deepPath: string; value: any }>) => {
            const { deepPath, value } = action.payload;
            return setInPath(deepPath, value, state);
        },
    },
});

export const formsDataReducerActions = formsDataSlice.actions;

export default formsDataSlice.reducer;
