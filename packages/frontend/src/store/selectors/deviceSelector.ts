import { Locations } from 'frontend/src/types';
import { getDevices } from 'frontend/src/utils/getters';
import { createSelector } from 'reselect';

export const locationsSelector = createSelector(getDevices, (devices) => {
    const buildings: Locations = new Map<string, Set<string>>();
    devices.forEach((device) => {
        const { building, room } = device.info.location;
        const rooms = buildings.get(building) || new Set();
        buildings.set(building, rooms.add(room));
    });

    return buildings;
});
