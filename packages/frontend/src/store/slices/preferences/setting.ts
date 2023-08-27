import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const detectedColorMode =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export interface PreferencesState {
    colorMode: 'light' | 'dark';
}
const initialState: PreferencesState = {
    colorMode: detectedColorMode,
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
