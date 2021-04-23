import validationFactory from "framework-ui/lib/validations/validationFactory";
import { assocPath, isNil } from "ramda";
import { AuthTypes, NotifyIntervals } from "./constants";
import { DeviceCommand } from "./models/interface/device";
import { NotifyType } from "./models/interface/notifyInterface";
import { transformToForm } from "framework-ui/lib/utils/transformToForm";
import { fieldDescriptors, fieldDescriptor } from "framework-ui/lib/types";

const LOGIN: fieldDescriptors = {
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
        when: ({ authType }: any) => authType === AuthTypes.PASSWD,
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
const userFields: fieldDescriptors = {
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
            required: true,
            validations: [validationFactory("isEmail")],
        },
    },
    auth: {
        type: {
            deepPath: "REGISTRATION.auth.type",
            required: false,
            label: "Pokročilá autentizace",
            name: "authtype",
            validations: [validationFactory("isString", { min: 4, max: 20 })],
        },
    },
};

const passwd: fieldDescriptor = {
    deepPath: "REGISTRATION.auth.password",
    required: true,
    label: "Heslo",
    name: "password",
    validations: [validationFactory("isString", { min: 4, max: 20 })],
};

const REGISTRATION = assocPath(["auth", "password"], passwd, userFields);

const passwdNotReq: fieldDescriptor = {
    deepPath: "EDIT_USER.auth.password",
    required: false,
    label: "Heslo",
    name: "password",
    validations: [validationFactory("isString", { min: 4, max: 20 })],
};

const EDIT_USER: fieldDescriptors = assocPath(["auth", "password"], passwdNotReq, {
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
    info: {
        name: {
            deepPath: "CREATE_DEVICE.info.name",
            required: true,
            label: "Název",
            name: "title",
            validations: [validationFactory("isString", { min: 4, max: 20 })],
        },
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

const EDIT_PERMISSIONS: fieldDescriptors = {
    read: {
        deepPath: "EDIT_PERMISSIONS.read",
        label: "Čtení",
        required: true,
    },
    write: {
        deepPath: "EDIT_PERMISSIONS.write",
        required: true,
        label: "Editace",
    },
    control: {
        deepPath: "EDIT_PERMISSIONS.control",
        label: "Ovládání",
        required: true,
    },
};

const EDIT_DEVICE: fieldDescriptors = {
    info: {
        name: {
            deepPath: "EDIT_DEVICE.info.name",
            required: true,
            label: "Název",
            name: "title",
            validations: [validationFactory("isString", { min: 4, max: 20 })],
        },
        location: {
            building: {
                deepPath: "EDIT_DEVICE.info.location.building",
                required: true,
                label: "Budova",
                validations: [validationFactory("isString", { min: 2, max: 50 })],
            },
            room: {
                deepPath: "EDIT_DEVICE.info.location.room",
                required: true,
                label: "Místnost",
                validations: [validationFactory("isString", { min: 2, max: 50 })],
            },
        },
    },
    permissions: transformToForm("EDIT_DEVICE.permissions", EDIT_PERMISSIONS),
};

const EDIT_NOTIFY: fieldDescriptors = {
    "propertyId[]": {
        deepPath: "EDIT_NOTIFY.propertyId[]",
        getLength: ({ count }) => count,
        label: "Vlastnost",
        required: true,
        validations: [validationFactory("isString")],
    },
    "type[]": {
        deepPath: "EDIT_NOTIFY.type[]",
        getLength: ({ count }) => count,
        label: "Podmínka",
        required: true,
        validations: [validationFactory("isOneOf", { values: Object.values(NotifyType) })],
    },
    "value[]": {
        deepPath: "EDIT_NOTIFY.value[]",
        getLength: ({ count }) => count,
        label: "Mezní hodnota",
        required: true,
        when: ({ type }, { i }) => isNil(type) || isNil(i) || type[i] !== NotifyType.always,
        // validations: [validationFactory("isNumber")],
    },
    advanced: {
        "daysOfWeek[]": {
            deepPath: "EDIT_NOTIFY.advanced.daysOfWeek[]",
            getLength: ({ count }) => count,
            label: "Dny v týdnu",
            required: true,
            validations: [validationFactory("isArray", { min: 1, max: 7 })],
        },
        "interval[]": {
            deepPath: "EDIT_NOTIFY.advanced.interval[]",
            getLength: ({ count }) => count,
            label: "Interval",
            required: true,
            validations: [validationFactory("isOneOf", { values: NotifyIntervals.map((obj) => obj.value) })],
        },
        "from[]": {
            deepPath: "EDIT_NOTIFY.advanced.from[]",
            getLength: ({ count }) => count,
            label: "Od",
            required: true,
            validations: [validationFactory("isTime")],
        },
        "to[]": {
            deepPath: "EDIT_NOTIFY.advanced.to[]",
            getLength: ({ count }) => count,
            label: "Do",
            required: true,
            validations: [validationFactory("isTime")],
        },
    },
    count: {
        deepPath: "EDIT_NOTIFY.count",
        required: true,
        validations: [validationFactory("isNumber", { max: 20 })],
    },
};

const USER_MANAGEMENT: fieldDescriptors = {
    selected: {
        deepPath: "USER_MANAGEMENT.selected",
        required: true,
        validations: [validationFactory("isNotEmptyArray")],
    },
};
const DEVICE_MANAGEMENT: fieldDescriptors = {
    selected: {
        deepPath: "DEVICE_MANAGEMENT.selected",
        required: true,
        validations: [validationFactory("isNotEmptyArray")],
    },
};

const DISCOVERY_DEVICES: fieldDescriptors = {
    selected: {
        deepPath: "DISCOVERY_DEVICES.selected",
        required: true,
        validations: [validationFactory("isNotEmptyArray")],
    },
};

const FIREBASE_ADD: fieldDescriptors = {
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

const DEVICE_SEND: fieldDescriptors = {
    command: {
        deepPath: "DEVICE_SEND.command",
        label: "Příkaz",
        required: true,
        validations: [validationFactory("isOneOf", { values: Object.values(DeviceCommand) })],
    },
};

const descriptors: fieldDescriptors = {
    LOGIN,
    REGISTRATION,
    USER_MANAGEMENT,
    EDIT_USER,
    CREATE_DEVICE,
    EDIT_DEVICE,
    EDIT_PERMISSIONS,
    EDIT_NOTIFY,
    FIREBASE_ADD,
    DEVICE_MANAGEMENT,
    DISCOVERY_DEVICES,
    DEVICE_SEND,
};

export default descriptors;
