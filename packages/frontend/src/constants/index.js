import {
    CONTROL_TYPES,
    NOTIFY_INTERVALS,
    NOTIFY_TYPES_CONTROL,
    NOTIFY_TYPES,
    CONTROL_STATE,
} from 'common/lib/constants';

export const NotifyControlTypes = {
    [CONTROL_STATE.ON]: [
        { value: NOTIFY_TYPES.ALWAYS, label: 'Vždy' },
        { value: NOTIFY_TYPES_CONTROL.ON, label: 'Zapnuto' },
        { value: NOTIFY_TYPES_CONTROL.OFF, label: 'Vypnuto' },
    ],
    [CONTROL_STATE.COLOR]: [{ value: NOTIFY_TYPES.ALWAYS, label: 'Vždy' }],
    [CONTROL_STATE.TYPE]: [{ value: NOTIFY_TYPES.ALWAYS, label: 'Vždy' }],
    [CONTROL_STATE.BRIGHT]: [{ value: NOTIFY_TYPES.ALWAYS, label: 'Vždy' }],
};

const on = { value: CONTROL_STATE.ON, label: 'Zapnutí' };

// For NOTIFICATION use
export const ControlStateTypes = {
    [CONTROL_TYPES.SWITCH]: [on],
    [CONTROL_TYPES.ACTIVATOR]: [on],
    [CONTROL_TYPES.RGB_SWITCH]: [
        on,
        { value: CONTROL_STATE.COLOR, label: 'Barva' },
        { value: CONTROL_STATE.TYPE, label: 'Typ' },
        { value: CONTROL_STATE.BRIGHT, label: 'Jas' },
    ],
};

export const ControlTypesFormNames = {
    [CONTROL_TYPES.SWITCH]: 'CHANGE_DEVICE_STATE_SWITCH',
    [CONTROL_TYPES.ACTIVATOR]: 'CHANGE_DEVICE_STATE_SWITCH',
    [CONTROL_TYPES.RGB_SWITCH]: 'CHANGE_DEVICE_STATE_RGB',
    [CONTROL_TYPES.MUSIC_CAST]: 'CHANGE_DEVICE_STATE_SWITCH',
};

export const AFK_INTERVAL = 10 * 60 * 1000; // 10 min

export const IMAGES_PREFIX_FOLDER = '/images';

export const daysInWeek = [
    { value: 1, label: 'Po' },
    { value: 2, label: 'Út' },
    { value: 3, label: 'St' },
    { value: 4, label: 'Čt' },
    { value: 5, label: 'Pá' },
    { value: 6, label: 'So' },
    { value: 0, label: 'Ne' },
];

export const TokenPermissions = [
    { value: ['read'], label: 'čtení' },
    { value: ['read', 'control'], label: 'čtení/ovládání' },
    { value: ['read', 'write', 'control'], label: 'úplné' },
];
