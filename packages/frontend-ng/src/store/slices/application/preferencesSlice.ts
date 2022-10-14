import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PreferencesState {
    colorMode: 'light' | 'dark';
}
const initialState: PreferencesState = { colorMode: 'dark' };

export const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        setColorMode: (state, action: PayloadAction<PreferencesState['colorMode']>) => {
            state.colorMode = action.payload;
        },
    },
});

export const preferencesActions = preferencesSlice.actions;

export default preferencesSlice.reducer;
