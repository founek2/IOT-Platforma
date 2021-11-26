import { createSelector } from 'reselect';
import { IDevice } from 'common/lib/models/interface/device';
import { Locations } from 'frontend/src/types';

export const locationsSelector = createSelector<any, { data: IDevice[] }, Locations>(
    (state: any) => state.application.devices,
    ({ data: devices }: { data: IDevice[] }) => {
        const buildings = new Map<string, Set<string>>();
        devices.forEach((device) => {
            const { building, room } = device.info.location;
            const rooms = buildings.get(building) || new Set();
            buildings.set(building, rooms.add(room));
        });

        return buildings;
    }
);
