import { Dictionary } from '@reduxjs/toolkit';
import { getPreferencesOrder } from './getters';

export function byPreferences<T extends { order: number }, U extends { id: string }>(preferences: Dictionary<T>) {
    return (a: U, b: U) => getPreferencesOrder(a.id, preferences) - getPreferencesOrder(b.id, preferences);
}
