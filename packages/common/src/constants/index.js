export const DAY_START_HOURS = 6

export const DAY_END_HOURS = 20

export const CONTROL_TYPES = {
    SWITCH: "SWITCH",	/* state: {color: [hashColor], type: "linear", bright: [0-255], on: [0,1]} */
    ACTIVATOR: "ACTIVATOR",	/* state: {on: 1} */
    RGB_SWITCH: "RGB_SWITCH",
    MUSIC_CAST: "MUSIC_CAST",		/* state: {on: [0,1]} */
}

export const NOTIFY_INTERVALS = {
    JUST_ONCE: -1,
    ALWAYS: -2,
}

export const NOTIFY_TYPES_CONTROL = {
    ON: "ON",
    OFF: "OFF",
}

export const CONTROL_STATE = {
    ON: "on",
    COLOR: "color",
    TYPE: "type",
    BRIGHT: "bright",
}

export const ControlStateValuesToText = {
    [CONTROL_STATE.ON]: (val) => val === 1 ? "Zapnuto" : "Vypnuto",
    [CONTROL_STATE.COLOR]: (val) => val,
    [CONTROL_STATE.TYPE]: (type) => type,
    [CONTROL_STATE.BRIGHT]: (val) => val + "%",
}


//AuthTypes, ControlTypes, SampleIntervals, RgbTypes, LINEAR_TYPE, NotifyTypes, NOTIFY_TYPES, NotifyIntervals, CONTROL_STATE_KEYS 

export const AuthTypes = {
    PASSWD: "passwd",
    WEB_AUTH: "webAuth"
}

export const ControlTypes = [
    { value: CONTROL_TYPES.SWITCH, label: "vypínač", formName: "CHANGE_DEVICE_STATE_SWITCH" },
    { value: CONTROL_TYPES.ACTIVATOR, label: "Aktivátor", formName: "CHANGE_DEVICE_STATE_SWITCH" },
    { value: CONTROL_TYPES.RGB_SWITCH, label: "RGB led", formName: "CHANGE_DEVICE_STATE_RGB" },
    { value: CONTROL_TYPES.MUSIC_CAST, label: "MusicCast", formName: "CHANGE_DEVICE_MUSIC_CAST" },
]

export const SampleIntervals = [
    { value: -1, label: "Nikdy" },
    { value: 0.1, label: "Vždy" },
    { value: 1 * 60, label: "1 min" },
    { value: 2 * 60, label: "2 min" },
    { value: 5 * 60, label: "5 min" },
    { value: 10 * 60, label: "10 min" },
    { value: 15 * 60, label: "15 min" },
    { value: 30 * 60, label: "30 min" },
    { value: 60 * 60, label: "1 hod" },
    { value: 120 * 60, label: "2 hod" },
    { value: 300 * 60, label: "5 hod" },
]

export const LINEAR_TYPE = "linear";

export const RgbTypes = [
    { value: LINEAR_TYPE, label: "Stálá barva" },
]

export const NOTIFY_TYPES = {
    OVER: "OVER",
    BELOW: "BELOW",
    // CHANGE: null,
    ALWAYS: "ALWAYS",
}

export const NotifyTypes = [
    { value: NOTIFY_TYPES.OVER, label: "Nad" },
    { value: NOTIFY_TYPES.BELOW, label: "Pod" },
    // { value: NOTIFY_TYPES.CHANGE, label: "Změna" },
    { value: NOTIFY_TYPES.ALWAYS, label: "Vždy" },
]

export const NotifyIntervals = [
    { value: NOTIFY_INTERVALS.JUST_ONCE, label: "Jednou" },
    { value: 1, label: "1 min" },
    { value: 5, label: "5 min" },
    { value: 10, label: "10 min" },
    { value: 20, label: "20 min" },
    { value: 60, label: "1 hod" },
    { value: 60 * 6, label: "6 hod" },
    { value: 60 * 12, label: "12 hod" },
    { value: NOTIFY_INTERVALS.ALWAYS, label: "Vždy" },
]

export const CONTROL_STATE_KEYS = [
    CONTROL_STATE.ON,
    CONTROL_STATE.COLOR,
    CONTROL_STATE.TYPE, CONTROL_STATE.BRIGHT
]
