import { Dictionary } from 'ramda';
import { getPreferencesOrder } from '../selectors/getters.js';

export function byPreferences<T extends { order: number }, U extends { id: string }>(preferences: Dictionary<T>) {
    return (a: U, b: U) => getPreferencesOrder(a.id, preferences) - getPreferencesOrder(b.id, preferences);
}
