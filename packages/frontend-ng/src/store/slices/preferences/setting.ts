import { createSlice, EntityState, PayloadAction, createEntityAdapter } from '@reduxjs/toolkit';

export interface PreferencesState {
    colorMode: 'light' | 'dark';
}
const initialState: PreferencesState = {
    colorMode: 'dark',
};

export const preferencesSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        setColorMode: (state, action: PayloadAction<PreferencesState['colorMode']>) => {
            state.colorMode = action.payload;
        },
    },
});

export const preferencesActions = preferencesSlice.actions;

export default preferencesSlice.reducer;
