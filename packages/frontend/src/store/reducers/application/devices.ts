import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IDevice } from 'common/lib/models/interface/device';

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

// const alter = curry((action, key, path, items) => map(when(pathEq(path, key), action), items));
// const updateThingF = compose(over(lensProp('things')), alter);

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
        // updateThing: ({ data, lastFetch }, action: PayloadAction<SocketUpdateThingState>) => {
        //     const {
        //         _id,
        //         thing: { nodeId, ...updateData },
        //     } = action.payload;

        //     const newData = alter(
        //         updateThingF(mergeDeepLeft(updateData), nodeId, ['config', 'nodeId']),
        //         _id,
        //         ['_id'],
        //         data
        //     );
        //     return { lastFetch, data: newData, lastUpdate: new Date() };
        // },
    },
});

export const devicesReducerActions = devicesSlice.actions;
export const deviceSelectors = devicesAdapter.getSelectors();

export default devicesSlice.reducer;
