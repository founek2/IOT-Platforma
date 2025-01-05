import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PluginsState {
    stream: PluginState
}
export interface PluginState {
    enabled: boolean;
}

const initialState: PluginsState = {
    stream: {
        enabled: false
    }
};

export const pluginsSlice = createSlice({
    name: 'plugins',
    initialState,
    reducers: {
        updatePlugin: (state, action: PayloadAction<{ plugin: keyof PluginsState, state: Partial<PluginState> }>) => {
            state[action.payload.plugin] = { ...state[action.payload.plugin], ...action.payload.state }
        },
    },
});

export const pluginsReducerActions = pluginsSlice.actions;

export default pluginsSlice.reducer;
