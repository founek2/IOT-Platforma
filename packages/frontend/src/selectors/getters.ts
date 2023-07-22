import { createSelector, Dictionary, EntityId } from '@reduxjs/toolkit';
import { IThing } from 'common/lib/models/interface/thing';
import { RootState } from '../store';
import { Device } from '../store/slices/application/devicesSlice';
import { thingSelectors } from '../store/slices/application/thingsSlice';
import { devicePreferencesSelectors } from '../store/slices/preferences/deviceSlice';
import { buildingsCachedSelector } from './devicesSelector';

export const getColorMode = (state: RootState) => state.preferences.setting.colorMode;

export const getDevicePreferences = (state: RootState) =>
    devicePreferencesSelectors.selectAll(state.preferences.devices);

export const getPreferencesOrder = <T extends { order: number }>(key: string, preferences: Dictionary<T>) =>
    preferences[key]?.order ?? 333;

export const getApplication = (state: RootState) => state.application;

export const getThings = (state: RootState) => state.application.things;

export const getNotifications = (state: RootState) => state.notifications;

export const isLoggedIn = (state: RootState) => state.application.authorization.loggedIn;

export const getCurrentUserName = (state: RootState) => state.application.authorization.currentUser?.info.userName;

export const getCurrentGroups = (state: RootState) => state.application.authorization.currentUser?.groups || [];

export const getDevices = (state: RootState) => state.application.devices;

export const getDevice = (id: Device['_id']) => (state: RootState) => state.application.devices.entities[id];

export const getAllDevices = (state: RootState) =>
    state.application.devices.ids.map((id: EntityId) => state.application.devices.entities[id]!);

export const getDevicesById = (deviceIDs: String[]) => {
    return createSelector(getDevices, (state) => {
        const entities: Device[] = [];
        state.ids.forEach((id) => deviceIDs.includes(id as any) && entities.push(state.entities[id] as any));

        return entities;
    });
};

export const getThing = (thingId: IThing['_id']) => createSelector(getThings, (state) => state.entities[thingId]);

export const getRoomLocation = (buildingName: string, roomName: string) =>
    createSelector(buildingsCachedSelector, (buildings) => {
        const buildingObj = buildings.find((b) => b.name === buildingName);
        if (!buildingObj) return undefined;

        return buildingObj.rooms.find((r) => r.name === roomName);
    });
