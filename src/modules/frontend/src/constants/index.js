//import keymirror from 'key-mirror';

export const AuthTypes = {
	PASSWD: "passwd",
	WEB_AUTH: "webAuth"
}

export const SampleIntervals = [
	{value: -1, label: "Nikdy"},
	{value: 0.1, label: "Vždy"},
	{value: 1 * 60, label: "1 min"},
	{value: 2 * 60, label: "2 min"},
	{value: 5 * 60,label: "5 min"},
	{value : 10 * 60, label: "10 min"},
	{value: 15 * 60, label: "15 min"},
	{value: 30 * 60, label: "30 min"},
	{value: 60 * 60, label: "1 hod"},
	{value: 120 * 60, label: "2 hod"},
	{value: 300 * 60, label: "5 hod"},
]

export const ControlTypes = [
	{value: "switch", label: "vypínač", formName: "CHANGE_DEVICE_STATE_SWITCH"},
	{value: "activator", label: "Aktivátor", formName: "CHANGE_DEVICE_STATE_SWITCH"},
	{value: "rgbSwitch", label: "RGB led",  formName: "CHANGE_DEVICE_STATE_RGB"},
]

export const ControlTypesFormNames = {
	switch: "CHANGE_DEVICE_STATE_SWITCH",
	activator: "CHANGE_DEVICE_STATE_SWITCH",
	rgbSwitch: "CHANGE_DEVICE_STATE_RGB",
}

export const LINEAR_TYPE = "linear";

export const RgbTypes = [
	{value: LINEAR_TYPE, label: "Stálá barva"},
	// {value: "switch", label: "vypínač"},
	// {value: "switch", label: "vypínač"},
]

export const AFK_INTERVAL = 10 * 60 * 1000 // 10 min

export const IMAGES_PREFIX_FOLDER = "/images"