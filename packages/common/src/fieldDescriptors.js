import validationFactory from 'framework-ui/lib/validations/validationFactory';
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
    CONTROL_TYPES
} from './constants';
import { assocPath, is, forEachObjIndexed } from 'ramda';
import setInPath from 'framework-ui/lib/utils/setInPath';
import { NotifyType } from './models/interface/notifyInterface';
import { DeviceCommand } from './models/interface/device';

function recursive(transform, predicate, object) {
    const func = (accum = '') => (value, key) => {
        if (predicate(value)) return rec(value, accum + key + '.');
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
        deepPath: 'LOGIN.userName',
        required: true,
        label: 'Uživatelské jméno',
        name: 'username',
        validations: [ validationFactory('isString', { min: 4, max: 30 }) ]
    },
    password: {
        deepPath: 'LOGIN.password',
        required: true,
        when: ({ authType }) => authType === AuthTypes.PASSWD,
        label: 'Heslo',
        name: 'password',
        validations: [ validationFactory('isString', { min: 4, max: 20 }) ]
    },
    authType: {
        deepPath: 'LOGIN.authType',
        required: true,
        label: 'Pokročilá autentizace',
        name: 'authtype',
        validations: [ validationFactory('isString', { min: 4, max: 20 }) ]
    }
};
const userFields = {
    info: {
        userName: {
            deepPath: 'REGISTRATION.info.userName',
            required: true,
            label: 'Uživatelské jméno',
            name: 'username',
            validations: [ validationFactory('isString', { min: 4, max: 30 }) ]
        },
        firstName: {
            deepPath: 'REGISTRATION.info.firstName',
            required: true,
            label: 'Jméno',
            name: 'firstname',
            validations: [ validationFactory('isString', { min: 2, max: 20 }) ]
        },
        lastName: {
            deepPath: 'REGISTRATION.info.lastName',
            required: true,
            label: 'Příjmení',
            name: 'lastname',
            validations: [ validationFactory('isString', { min: 2, max: 20 }) ]
        },
        email: {
            deepPath: 'REGISTRATION.info.email',
            label: 'Email',
            name: 'email',
            required: true,
            validations: [ validationFactory('isEmail') ]
        }
    },
    auth: {
        type: {
            deepPath: 'REGISTRATION.auth.type',
            // required: true,
            label: 'Pokročilá autentizace',
            name: 'authtype',
            validations: [ validationFactory('isString', { min: 4, max: 20 }) ]
        }
    }
};

const passwd = {
    deepPath: 'REGISTRATION.auth.password',
    required: true,
    label: 'Heslo',
    name: 'password',
    validations: [ validationFactory('isString', { min: 4, max: 20 }) ]
};

const REGISTRATION = assocPath([ 'auth', 'password' ], passwd, userFields);

const passwdNotReq = {
    deepPath: 'EDIT_USER.auth.password',
    // required: true,
    label: 'Heslo',
    name: 'password',
    validations: [ validationFactory('isString', { min: 4, max: 20 }) ]
};

const EDIT_USER = assocPath([ 'auth', 'password' ], passwdNotReq, {
    ...transformToForm('EDIT_USER', userFields),
    groups: {
        deepPath: 'EDIT_USER.groups',
        label: 'Uživatelské skupiny',
        required: true,
        name: 'groups',
        validations: [ validationFactory('isNotEmptyArray') ]
    }
});

const CREATE_DEVICE = {
    info: {
        name: {
            deepPath: 'CREATE_DEVICE.info.name',
            required: true,
            label: 'Název',
            name: 'title',
            validations: [ validationFactory('isString', { min: 4, max: 20 }) ]
        },
        location: {
            building: {
                deepPath: 'CREATE_DEVICE.info.location.building',
                required: true,
                label: 'Budova',
                validations: [ validationFactory('isString', { min: 2, max: 50 }) ]
            },
            room: {
                deepPath: 'CREATE_DEVICE.info.location.room',
                required: true,
                label: 'Místnost',
                validations: [ validationFactory('isString', { min: 2, max: 50 }) ]
            }
        }
    }
};

const EDIT_PERMISSIONS = {
    read: {
        deepPath: 'EDIT_PERMISSIONS.read',
        label: 'Čtení'
    },
    write: {
        deepPath: 'EDIT_PERMISSIONS.write',
        required: true,
        label: 'Editace'
    },
    control: {
        deepPath: 'EDIT_PERMISSIONS.control',
        label: 'Ovládání'
    }
};

const EDIT_DEVICE = {
    info: {
        name: {
            deepPath: 'EDIT_DEVICE.info.name',
            required: true,
            label: 'Název',
            name: 'title',
            validations: [ validationFactory('isString', { min: 4, max: 20 }) ]
        },
        location: {
            building: {
                deepPath: 'EDIT_DEVICE.info.location.building',
                required: true,
                label: 'Budova',
                validations: [ validationFactory('isString', { min: 2, max: 50 }) ]
            },
            room: {
                deepPath: 'EDIT_DEVICE.info.location.room',
                required: true,
                label: 'Místnost',
                validations: [ validationFactory('isString', { min: 2, max: 50 }) ]
            }
        }
    },
    permissions: transformToForm('EDIT_DEVICE.permissions', EDIT_PERMISSIONS)
};

const EDIT_NOTIFY = {
    'propertyId[]': {
        deepPath: 'EDIT_NOTIFY.propertyId[]',
        label: 'Vlastnost',
        required: true,
        validations: [ validationFactory('isString') ]
    },
    'type[]': {
        deepPath: 'EDIT_NOTIFY.type[]',
        label: 'Podmínka',
        required: true,
        validations: [ validationFactory('isOneOf', { values: Object.values(NotifyType) }) ]
    },
    'value[]': {
        deepPath: 'EDIT_NOTIFY.value[]',
        label: 'Mezní hodnota',
        required: true,
        when: ({ type }, { i }) => !type || type[i] !== NotifyType.always
        // validations: [validationFactory("isNumber")],
    },
    advanced: {
        'daysOfWeek[]': {
            deepPath: 'EDIT_NOTIFY.advanced.daysOfWeek[]',
            label: 'Dny v týdnu',
            // required: true,
            validations: [ validationFactory('isArray', { min: 1, max: 200 }) ]
        },
        'interval[]': {
            deepPath: 'EDIT_NOTIFY.advanced.interval[]',
            label: 'Interval',
            // required: true,
            validations: [ validationFactory('isOneOf', { values: NotifyIntervals.map((obj) => obj.value) }) ]
        },
        'from[]': {
            deepPath: 'EDIT_NOTIFY.advanced.from[]',
            label: 'Od',
            // required: true,
            validations: [ validationFactory('isTime') ]
        },
        'to[]': {
            deepPath: 'EDIT_NOTIFY.advanced.to[]',
            label: 'Do',
            // required: true,
            validations: [ validationFactory('isTime') ]
        }
    },
    count: {
        deepPath: 'EDIT_NOTIFY.count',
        required: true,
        validations: [ validationFactory('isNumber') ]
    }
};

const USER_MANAGEMENT = {
    selected: {
        deepPath: 'USER_MANAGEMENT.selected',
        required: true,
        validations: [ validationFactory('isNotEmptyArray') ]
    }
};
const DEVICE_MANAGEMENT = {
    selected: {
        deepPath: 'DEVICE_MANAGEMENT.selected',
        required: true,
        validations: [ validationFactory('isNotEmptyArray') ]
    }
};

const DISCOVERY_DEVICES = {
    selected: {
        deepPath: 'DISCOVERY_DEVICES.selected',
        required: true,
        validations: [ validationFactory('isNotEmptyArray') ]
    }
};

const FIREBASE_ADD = {
    token: {
        deepPath: 'FIREBASE_ADD.token',
        label: 'Token',
        required: true,
        validations: [
            validationFactory('isString', {
                min: 100
            })
        ]
    }
};

const DEVICE_SEND = {
    command: {
        deepPath: 'DEVICE_SEND.command',
        label: 'Příkaz',
        required: true,
        validations: [ validationFactory('isOneOf', { values: Object.values(DeviceCommand) }) ]
    }
};

export default {
    LOGIN,
    REGISTRATION,
    USER_MANAGEMENT,
    EDIT_USER,
    CREATE_DEVICE,
    EDIT_DEVICE,
    EDIT_PERMISSIONS,
    EDIT_NOTIFY,
    EDIT_NOTIFY,
    FIREBASE_ADD,
    DEVICE_MANAGEMENT,
    DISCOVERY_DEVICES,
    DEVICE_SEND
};
