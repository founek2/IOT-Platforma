import validationFactory from 'framework-ui/src/validations/validationFactory';
import {AuthTypes} from '../constants'

const login = {
	LOGIN: {
		'userName': {
			deepPath: 'LOGIN.userName',
			required: true,
			label: 'Uživatelské jméno',
			validations: [
				validationFactory('isString', {min: 4, max: 20}),
			]
		},
		'password': {
			deepPath: 'LOGIN.password',
			required: true,
			when: ({authType}) => authType === AuthTypes.PASSWD,
			label: "Heslo",
			validations: [
				validationFactory('isString', {min: 4, max: 20}),
			]
		},
		'authType': {
			deepPath: 'LOGIN.authType',
			required: true,
			label: "Pokročilá autentizace",
			validations: [
				validationFactory('isString', {min: 4, max: 20}),
			]
		}
	},
};

const RegisterUser = {
	REGISTRATION: {
		'userName': {
			deepPath: 'REGISTRATION.userName',
			required: true,
			label: "Uživatelské jméno",
			validations: [
				validationFactory('isString', {min: 4, max: 20}),
			]
		},
		'firstName': {
			deepPath: 'REGISTRATION.firstName',
			required: true,
			label: "Jméno",
			validations: [
				validationFactory('isString', {min: 2, max: 20}),
			]
		},
		'lastName': {
			deepPath: 'REGISTRATION.lastName',
			required: true,
			label: "Příjmení",
			validations: [
				validationFactory('isString', {min: 2, max: 20}),
			]
		},
		authType: {
			deepPath: 'REGISTRATION.authType',
			// required: true,
			label: "Pokročilá autentizace",
			validations: [
				validationFactory('isString', {min: 4, max: 20}),
			]
		},
		password: {
			deepPath: 'REGISTRATION.password',
			required: true,
			label: "Heslo",
			validations: [
				validationFactory('isString', {min: 4, max: 20}),
			]
		},
		email: {
			deepPath: 'REGISTRATION.email',
			label: "Email",
			validations: [
				validationFactory('isEmail'),
			]
		},
		phoneNumber: {
			deepPath: 'REGISTRATION.phoneNumber',
			label: "Telefonní číslo",
			validations: [
				validationFactory('isPhoneNumber'),
			]
		},
		groups: {
			defaultValue: ["user"],
			deepPath: 'REGISTRATION.groups',
			label: "Uživatelské skupiny",
			validations: [
				validationFactory('isNotEmptyArray'),
			]
		},
	}
}

const CreateDevice = {
	CREATE_DEVICE: {
		'title': {
			deepPath: 'CREATE_DEVICE.title',
			required: true,
			label: "Název",
			validations: [
				validationFactory('isString', {min: 4, max: 20}),
			]
		},
		'description': {
			deepPath: 'CREATE_DEVICE.description',
			label: "Popis",
			validations: [
				validationFactory('isString', {min: 2, max: 200}),
			]
		},
		'image': {
			deepPath: 'CREATE_DEVICE.image',
			required: true,
			label: "Obrázek",
			validations: [
				validationFactory('isFile'),
			]
		},
		'gpsLat': {
			deepPath: 'CREATE_DEVICE.gpsLat',
			required: true,
			label: "Zeměpisná šířka",
			validations: [
				validationFactory('isNumber'),
			]
		},
		'gpsLng': {
			deepPath: 'CREATE_DEVICE.gpsLng',
			required: true,
			label: "Zeměpisná délka",
			validations: [
				validationFactory('isNumber'),
			]
		},
	}
}

const EditDevice = {
	EDIT_DEVICE: {
		'title': {
			deepPath: 'EDIT_DEVICE.title',
			required: true,
			label: "Název",
			validations: [
				validationFactory('isString', {min: 4, max: 20}),
			]
		},
		'description': {
			deepPath: 'EDIT_DEVICE.description',
			label: "Popis",
			validations: [
				validationFactory('isString', {min: 2, max: 200}),
			]
		},
		'image': {
			deepPath: 'EDIT_DEVICE.image',
			label: "Obrázek",
			validations: [
				validationFactory('isFile'),
			]
		},
		'gpsLat': {
			deepPath: 'EDIT_DEVICE.gpsLat',
			required: true,
			label: "Zeměpisná šířka",
			validations: [
				validationFactory('isNumber'),
			]
		},
		'gpsLng': {
			deepPath: 'EDIT_DEVICE.gpsLng',
			required: true,
			label: "Zeměpisná délka",
			validations: [
				validationFactory('isNumber'),
			]
		},
	}
}

const UserManagement = {
	USER_MANAGEMENT: {
		selected: {
			deepPath: "USER_MANAGEMENT.selected",
			required: true,
			validations: [
				validationFactory('isNotEmptyArray'),
			]
		}
	}
}


export default {
	...login,
	...RegisterUser,
	...UserManagement,
	...CreateDevice,
	...EditDevice
}