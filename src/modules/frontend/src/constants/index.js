import keymirror from 'key-mirror';

export const AuthTypes = {
	PASSWD: "passwd",
	WEB_AUTH: "webAuth"
}

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

export const NOTIFY_TYPES = keymirror({
	OVER: null,
	BELOW: null,
	// CHANGE: null,
	ALWAYS: null,
})

export const NOTIFY_TYPES_CONTROL = keymirror({
	ON: null,
	OFF: null,
})

export const NotifyTypes = [
	{ value: NOTIFY_TYPES.OVER, label: "Nad" },
	{ value: NOTIFY_TYPES.BELOW, label: "Pod" },
	// { value: NOTIFY_TYPES.CHANGE, label: "Změna" },
	{ value: NOTIFY_TYPES.ALWAYS, label: "Vždy" },
]

export const CONTROL_STATE = {
	ON: "on",
	COLOR: "color",
	TYPE: "type",
	BRIGHT: "bright",
}

export const NotifyControlTypes = {
	[CONTROL_STATE.ON]: [{ value: NOTIFY_TYPES.ALWAYS, label: "Vždy" }, { value: NOTIFY_TYPES_CONTROL.ON, label: "Zapnuto" }, { value: NOTIFY_TYPES_CONTROL.OFF, label: "Vypnuto" }],
	[CONTROL_STATE.COLOR]: [{ value: NOTIFY_TYPES.ALWAYS, label: "Vždy" }],
	[CONTROL_STATE.TYPE]: [{ value: NOTIFY_TYPES.ALWAYS, label: "Vždy" }],
	[CONTROL_STATE.BRIGHT]: [{ value: NOTIFY_TYPES.ALWAYS, label: "Vždy" }],
}

export const CONTROL_TYPES = keymirror({
	SWITCH: null,	/* state: {color: [hashColor], type: "linear", bright: [0-255], on: [0,1]} */
	ACTIVATOR: null,	/* state: {on: 1} */
	RGB_SWITCH: null		/* state: {on: [0,1]} */
})


const on = { value: CONTROL_STATE.ON, label: "Zapnutí" }

export const ControlStateTypes = {
	[CONTROL_TYPES.SWITCH]: [on],
	[CONTROL_TYPES.ACTIVATOR]: [on],
	[CONTROL_TYPES.RGB_SWITCH]: [
		on,
		{ value: CONTROL_STATE.COLOR, label: "Barva" },
		{ value: CONTROL_STATE.TYPE, label: "Typ" },
		{ value: CONTROL_STATE.BRIGHT, label: "Jas" },
	]
}

export const ControlStateValuesToText = {
	[CONTROL_STATE.ON]: (val) => val === 1 ? "Zapnuto" : "Vypnuto",
	[CONTROL_STATE.COLOR]: (val) => val,
	[CONTROL_STATE.TYPE]: (type) => type,
	[CONTROL_STATE.BRIGHT]: (val) => val + "%",
}

export const CONTROL_STATE_KEYS = [CONTROL_STATE.ON, CONTROL_STATE.COLOR, CONTROL_STATE.TYPE, CONTROL_STATE.BRIGHT]


export const ControlTypes = [
	{ value: CONTROL_TYPES.SWITCH, label: "vypínač", formName: "CHANGE_DEVICE_STATE_SWITCH" },
	{ value: CONTROL_TYPES.ACTIVATOR, label: "Aktivátor", formName: "CHANGE_DEVICE_STATE_SWITCH" },
	{ value: CONTROL_TYPES.RGB_SWITCH, label: "RGB led", formName: "CHANGE_DEVICE_STATE_RGB" },
]

export const ControlTypesFormNames = {
	[CONTROL_TYPES.SWITCH]: "CHANGE_DEVICE_STATE_SWITCH",
	[CONTROL_TYPES.ACTIVATOR]: "CHANGE_DEVICE_STATE_SWITCH",
	[CONTROL_TYPES.RGB_SWITCH]: "CHANGE_DEVICE_STATE_RGB",
}

export const LINEAR_TYPE = "linear";

export const RgbTypes = [
	{ value: LINEAR_TYPE, label: "Stálá barva" },
]

export const AFK_INTERVAL = 10 * 60 * 1000 // 10 min

export const IMAGES_PREFIX_FOLDER = "/images"

export const NOTIFY_INTERVALS = {
	JUST_ONCE: -1,
	ALWAYS: -2,
}

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

export const daysInWeek = [
	{ value: 1, label: "Po" },
	{ value: 2, label: "Út" },
	{ value: 3, label: "St" },
	{ value: 4, label: "Čt" },
	{ value: 5, label: "Pá" },
	{ value: 6, label: "So" },
	{ value: 0, label: "Ne" },
]

export const DAY_START_HOURS = 6

export const DAY_END_HOURS = 20