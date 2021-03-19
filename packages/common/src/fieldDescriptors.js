import validationFactory from "framework-ui/lib/validations/validationFactory";
import {
	AuthTypes,
	ControlTypes,
	SampleIntervals,
	RgbTypes,
	LINEAR_TYPE,
	NotifyTypes,
	NOTIFY_TYPES,
	NotifyIntervals,
	CONTROL_STATE_KEYS,
	CONTROL_TYPES,
} from "./constants";
import { assocPath, is, forEachObjIndexed } from "ramda";
import setInPath from "framework-ui/lib/utils/setInPath";
import { NotifyType } from "./models/interface/notifyInterface";

function recursive(transform, predicate, object) {
	const func = (accum = "") => (value, key) => {
		if (predicate(value)) return rec(value, accum + key + ".");
		transform(value, accum + key);
	};

	function rec(obj, accum) {
		forEachObjIndexed(func(accum), obj);
	}
	rec(object);
}

function transformToForm(formName, fields) {
	// TODO doesnt work for nested fields
	let result = {};
	recursive(
		(val, deepPath) => {
			const newVal = { ...val, deepPath: val.deepPath.replace(/[^.]*/, formName) };
			result = setInPath(deepPath, newVal, result);
		},
		(val) => is(Object, val) && !val.deepPath,
		fields
	);

	return result;
}

const LOGIN = {
	userName: {
		deepPath: "LOGIN.userName",
		required: true,
		label: "Uživatelské jméno",
		name: "username",
		validations: [validationFactory("isString", { min: 4, max: 30 })],
	},
	password: {
		deepPath: "LOGIN.password",
		required: true,
		when: ({ authType }) => authType === AuthTypes.PASSWD,
		label: "Heslo",
		name: "password",
		validations: [validationFactory("isString", { min: 4, max: 20 })],
	},
	authType: {
		deepPath: "LOGIN.authType",
		required: true,
		label: "Pokročilá autentizace",
		name: "authtype",
		validations: [validationFactory("isString", { min: 4, max: 20 })],
	},
};
const userFields = {
	info: {
		userName: {
			deepPath: "REGISTRATION.info.userName",
			required: true,
			label: "Uživatelské jméno",
			name: "username",
			validations: [validationFactory("isString", { min: 4, max: 30 })],
		},
		firstName: {
			deepPath: "REGISTRATION.info.firstName",
			required: true,
			label: "Jméno",
			name: "firstname",
			validations: [validationFactory("isString", { min: 2, max: 20 })],
		},
		lastName: {
			deepPath: "REGISTRATION.info.lastName",
			required: true,
			label: "Příjmení",
			name: "lastname",
			validations: [validationFactory("isString", { min: 2, max: 20 })],
		},
		email: {
			deepPath: "REGISTRATION.info.email",
			label: "Email",
			name: "email",
			validations: [validationFactory("isEmail")],
		},
		phoneNumber: {
			deepPath: "REGISTRATION.info.phoneNumber",
			label: "Telefonní číslo",
			name: "phonenumber",
			validations: [validationFactory("isPhoneNumber")],
		},
	},
	auth: {
		type: {
			deepPath: "REGISTRATION.auth.type",
			// required: true,
			label: "Pokročilá autentizace",
			name: "authtype",
			validations: [validationFactory("isString", { min: 4, max: 20 })],
		},
	},
};

const passwd = {
	deepPath: "REGISTRATION.auth.password",
	required: true,
	label: "Heslo",
	name: "password",
	validations: [validationFactory("isString", { min: 4, max: 20 })],
};

const REGISTRATION = assocPath(["auth", "password"], passwd, userFields);

const passwdNotReq = {
	deepPath: "EDIT_USER.auth.password",
	// required: true,
	label: "Heslo",
	name: "password",
	validations: [validationFactory("isString", { min: 4, max: 20 })],
};

const EDIT_USER = assocPath(["auth", "password"], passwdNotReq, {
	...transformToForm("EDIT_USER", userFields),
	groups: {
		deepPath: "EDIT_USER.groups",
		label: "Uživatelské skupiny",
		required: true,
		name: "groups",
		validations: [validationFactory("isNotEmptyArray")],
	},
});

const CREATE_DEVICE = {
	_id: {
		deepPath: "CREATE_DEVICE._id",
		required: true,
		validations: [validationFactory("isString", { min: 4, max: 50 })],
	},
	info: {
		name: {
			deepPath: "CREATE_DEVICE.info.name",
			required: true,
			label: "Název",
			name: "title",
			validations: [validationFactory("isString", { min: 4, max: 20 })],
		},
		// description: {
		// 	deepPath: "CREATE_DEVICE.info.description",
		// 	label: "Popis",
		// 	name: "description",
		// 	validations: [validationFactory("isString", { min: 2, max: 200 })],
		// },
		// image: {
		// 	deepPath: "CREATE_DEVICE.info.image",
		// 	required: true,
		// 	label: "Obrázek",
		// 	name: "image",
		// 	validations: [validationFactory("isFile")],
		// },
		location: {
			building: {
				deepPath: "CREATE_DEVICE.info.location.building",
				required: true,
				label: "Budova",
				validations: [validationFactory("isString", { min: 2, max: 50 })],
			},
			room: {
				deepPath: "CREATE_DEVICE.info.location.room",
				required: true,
				label: "Místnost",
				validations: [validationFactory("isString", { min: 2, max: 50 })],
			},
		},
	},
};

const EDIT_DEVICE = {
	info: {
		title: {
			deepPath: "EDIT_DEVICE.info.title",
			required: true,
			label: "Název",
			name: "title",
			validations: [validationFactory("isString", { min: 4, max: 20 })],
		},
		description: {
			deepPath: "EDIT_DEVICE.info.description",
			label: "Popis",
			name: "description",
			validations: [validationFactory("isString", { min: 2, max: 200 })],
		},
		image: {
			deepPath: "EDIT_DEVICE.info.image",
			label: "Obrázek",
			name: "image",
			validations: [validationFactory("isFile")],
		},
	},
	publicRead: {
		deepPath: "EDIT_DEVICE.publicRead",
		label: "Veřejné zařízení",
		name: "public",
		validations: [validationFactory("isBool")],
	},
	gps: {
		"coordinates[]": {
			deepPath: "EDIT_DEVICE.gps.coordinates[]",
			required: true,
			validations: [validationFactory("isNumber")],
		},
	},
	topic: {
		deepPath: "EDIT_DEVICE.topic",
		required: true,
		label: "Topic",
		name: "topic",
		validations: [validationFactory("isString", { min: 2, max: 100, startsWith: "/", pattern: /\/.+\/.+\/.+/ })],
	},
};

const EDIT_NOTIFY = {
	"propertyId[]": {
		deepPath: "EDIT_NOTIFY.propertyId[]",
		label: "Vlastnost",
		required: true,
		validations: [validationFactory("isString")],
	},
	"type[]": {
		deepPath: "EDIT_NOTIFY.type[]",
		label: "Podmínoa",
		required: true,
		validations: [validationFactory("isOneOf", { values: Object.values(NotifyType) })],
	},
	"value[]": {
		deepPath: "EDIT_NOTIFY.value[]",
		label: "Mezní hodnota",
		required: true,
		when: ({ type }, { i }) => !type || type[i] !== NotifyType.always,
		// validations: [validationFactory("isNumber")],
	},
	advanced: {
		"daysOfWeek[]": {
			deepPath: "EDIT_NOTIFY.advanced.daysOfWeek[]",
			label: "Dny v týdnu",
			// required: true,
			validations: [validationFactory("isArray", { min: 1, max: 200 })],
		},
		"interval[]": {
			deepPath: "EDIT_NOTIFY.advanced.interval[]",
			label: "Interval",
			// required: true,
			validations: [validationFactory("isOneOf", { values: NotifyIntervals.map((obj) => obj.value) })],
		},
		"from[]": {
			deepPath: "EDIT_NOTIFY.advanced.from[]",
			label: "Od",
			// required: true,
			validations: [validationFactory("isTime")],
		},
		"to[]": {
			deepPath: "EDIT_NOTIFY.advanced.to[]",
			label: "Do",
			// required: true,
			validations: [validationFactory("isTime")],
		},
	},
	count: {
		deepPath: "EDIT_NOTIFY.count",
		required: true,
		validations: [validationFactory("isNumber")],
	},
};

const EDIT_RGB = {
	type: {
		deepPath: "EDIT_RGB.type",
		label: "Typ",
		// required: true,
		name: "type",
		validations: [validationFactory("isOneOf", { values: RgbTypes.map((obj) => obj.value) })],
	},
	color: {
		deepPath: "EDIT_RGB.color",
		label: "Barva",
		required: true,
		name: "color",
		when: ({ type }) => type === LINEAR_TYPE,
		validations: [validationFactory("isColor")],
	},
	bright: {
		deepPath: "EDIT_RGB.bright",
		label: "Jas",
		name: "brightness",
		// required: true,
		validations: [validationFactory("isNumber", { min: 0, max: 100 })],
	},
	on: {
		deepPath: "EDIT_RGB.on",
		label: "Zapnuto",
		// required: true,
		validations: [validationFactory("isNumber", { min: 0, max: 1 })],
	},
};

const CHANGE_DEVICE_STATE_RGB = {
	JSONkey: {
		deepPath: "CHANGE_DEVICE_STATE_RGB.JSONkey",
		required: true,
	},
	state: {
		type: {
			deepPath: "CHANGE_DEVICE_STATE_RGB.state.type",
			label: "Typ",
			name: "type",
			validations: [validationFactory("isOneOf", { values: RgbTypes.map((obj) => obj.value) })],
		},
		color: {
			deepPath: "CHANGE_DEVICE_STATE_RGB.state.color",
			label: "Barva",
			name: "color",
			when: ({ type }) => type === LINEAR_TYPE,
			required: true,
			validations: [validationFactory("isColor")],
		},
		bright: {
			deepPath: "CHANGE_DEVICE_STATE_RGB.state.bright",
			label: "Jas",
			name: "brightness",
			validations: [validationFactory("isNumber", { min: 0, max: 100 })],
		},
		on: {
			deepPath: "CHANGE_DEVICE_STATE_RGB.state.on",
			label: "Zapnuto",
			validations: [validationFactory("isNumber", { min: 0, max: 1 })],
		},
	},
};

const CHANGE_DEVICE_STATE_SWITCH = {
	JSONkey: {
		deepPath: "CHANGE_DEVICE_STATE_SWITCH.JSONkey",
		required: true,
	},
	state: {
		on: {
			deepPath: "CHANGE_DEVICE_STATE_SWITCH.state.on",
			label: "Zapnuto",
			required: true,
			validations: [validationFactory("isNumber", { min: 0, max: 1 })],
		},
	},
};

const CHANGE_DEVICE_MUSIC_CAST = {
	JSONkey: {
		deepPath: "CHANGE_DEVICE_MUSIC_CAST.JSONkey",
		required: true,
	},
	state: {
		on: {
			deepPath: "CHANGE_DEVICE_MUSIC_CAST.state.on",
			label: "Zapnuto",
			validations: [validationFactory("isNumber", { min: 0, max: 1 })],
		},
		input: {
			deepPath: "CHANGE_DEVICE_MUSIC_CAST.state.input",
			label: "Vstup",
		},
	},
};

const USER_MANAGEMENT = {
	selected: {
		deepPath: "USER_MANAGEMENT.selected",
		required: true,
		validations: [validationFactory("isNotEmptyArray")],
	},
};
const DEVICE_MANAGEMENT = {
	selected: {
		deepPath: "DEVICE_MANAGEMENT.selected",
		required: true,
		validations: [validationFactory("isNotEmptyArray")],
	},
};

const DISCOVERY_DEVICES = {
	selected: {
		deepPath: "DISCOVERY_DEVICES.selected",
		required: true,
		validations: [validationFactory("isNotEmptyArray")],
	},
};

const EDIT_PERMISSIONS = {
	read: {
		deepPath: "EDIT_PERMISSIONS.read",
		label: "Čtení",
	},
	write: {
		deepPath: "EDIT_PERMISSIONS.write",
		required: true,
		label: "Editace",
	},
	control: {
		deepPath: "EDIT_PERMISSIONS.control",
		label: "Ovládání",
	},
};

const FIREBASE_ADD = {
	token: {
		deepPath: "FIREBASE_ADD.token",
		label: "Token",
		required: true,
		validations: [
			validationFactory("isString", {
				min: 100,
			}),
		],
	},
};

export default {
	LOGIN,
	REGISTRATION,
	USER_MANAGEMENT,
	EDIT_USER,
	CREATE_DEVICE,
	EDIT_DEVICE,
	EDIT_PERMISSIONS,
	EDIT_RGB,
	CHANGE_DEVICE_STATE_RGB,
	CHANGE_DEVICE_STATE_SWITCH,
	CHANGE_DEVICE_MUSIC_CAST,
	EDIT_NOTIFY,
	EDIT_NOTIFY,
	FIREBASE_ADD,
	DEVICE_MANAGEMENT,
	DISCOVERY_DEVICES,
};
