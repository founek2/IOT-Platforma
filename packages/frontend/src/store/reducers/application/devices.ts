import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IDevice } from 'common/src/models/interface/device';

export type Device = Omit<IDevice, 'things'> & { things: string[] };
// Define a type for the slice state
export interface DeviceState {
    data: IDevice[];
    lastFetch?: Date;
    lastUpdate?: Date;
}

const devicesAdapter = createEntityAdapter<Device>({
    // Assume IDs are stored in a field other than `book.id`
    selectId: (device) => device._id,
    // Keep the "all IDs" array sorted based on book titles
    sortComparer: (a, b) => a.info.name.localeCompare(b.info.name),
});

export const devicesSlice = createSlice({
    name: 'devices',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState: devicesAdapter.getInitialState(),
    reducers: {
        addOne: devicesAdapter.addOne,
        addMany: devicesAdapter.addMany,
        setOne: devicesAdapter.setOne,
        setAll: devicesAdapter.setAll,
        toDefault: () => {
            return devicesAdapter.getInitialState();
        },
        removeOne: devicesAdapter.removeOne,
        updateOne: devicesAdapter.updateOne,
    },
});

export const devicesReducerActions = devicesSlice.actions;
export const deviceSelectors = devicesAdapter.getSelectors();

export default devicesSlice.reducer;
