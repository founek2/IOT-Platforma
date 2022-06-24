import setInPath from '../../utils/setInPath';
import validationFactory from '../../validations/validationFactory';
import { State, FieldDescriptors } from '../../types';

const fieldDescriptors: FieldDescriptors = {
    REGISTRATION: {
        info: {
            userName: {
                deepPath: 'REGISTRATION.info.userName',
                required: true,
                label: 'Uživatelské jméno',
                name: 'username',
                validations: [validationFactory('isString', { min: 4, max: 30 })],
            },
            firstName: {
                deepPath: 'REGISTRATION.info.firstName',
                required: true,
                label: 'Jméno',
                name: 'firstname',
                validations: [validationFactory('isString', { min: 2, max: 20 })],
            },
            lastName: {
                deepPath: 'REGISTRATION.info.lastName',
                required: true,
                label: 'Příjmení',
                name: 'lastname',
                validations: [validationFactory('isString', { min: 2, max: 20 })],
            },
            email: {
                deepPath: 'REGISTRATION.info.email',
                label: 'Email',
                name: 'email',
                required: true,
                validations: [validationFactory('isEmail')],
            },
        },
        auth: {
            password: {
                deepPath: 'REGISTRATION.auth.password',
                required: true,
                label: 'Heslo',
                name: 'password',
                validations: [validationFactory('isString', { min: 4, max: 20 })],
            },
        },
    },
};

export const stateValid: State = {
    application: {
        notifications: [],
        authorization: {
            loggedIn: false,
            accessToken: '',
            tokenExpiryDate: '',
        },
    },
    formsData: {
        registeredFields: {
            REGISTRATION: {
                info: {
                    firstName: {
                        valid: true,
                        pristine: false,
                        errorMessages: [],
                    },
                    lastName: {
                        valid: true,
                        pristine: false,
                        errorMessages: [],
                    },
                    userName: {
                        valid: true,
                        pristine: false,
                        errorMessages: [],
                    },
                    email: {
                        valid: true,
                        pristine: true,
                    },
                },
                auth: {
                    password: {
                        valid: true,
                        pristine: false,
                        errorMessages: [],
                    },
                    type: {
                        valid: true,
                        pristine: true,
                    },
                },
            },
        },
        REGISTRATION: {
            info: {
                firstName: 'Martin',
                lastName: 'Skalický',
                userName: 'skalima',
                email: 'skalicky@iotplatforma.cloud',
            },
            auth: {
                password: '123456',
            },
        },
    },
    fieldDescriptors,
    // tmpData: {
    //     dialog: {},
    // },
    history: {
        pathname: '/registerUser',
        hash: '',
        search: '',
        query: {},
    },
};

export const stateInvalidPassword: State = {
    application: {
        notifications: [],
        authorization: {
            loggedIn: false,
            accessToken: '',
            tokenExpiryDate: '',
        },
    },
    formsData: {
        registeredFields: {
            REGISTRATION: {
                info: {
                    firstName: {
                        valid: true,
                        pristine: false,
                        errorMessages: [],
                    },
                    lastName: {
                        valid: true,
                        pristine: false,
                        errorMessages: [],
                    },
                    userName: {
                        valid: true,
                        pristine: false,
                        errorMessages: [],
                    },
                    email: {
                        valid: true,
                        pristine: true,
                    },
                },
                auth: {
                    password: {
                        valid: true,
                        pristine: false,
                    },
                    type: {
                        valid: true,
                        pristine: true,
                    },
                },
            },
        },
        REGISTRATION: {
            info: {
                firstName: 'Martin',
                lastName: 'Skalický',
                userName: 'skalima',
                email: 'skalicky@iotplatforma.cloud',
            },
            auth: {
                password: '123',
            },
        },
    },
    fieldDescriptors,
    // tmpData: {
    //     dialog: {},
    // },
    history: {
        pathname: '/registerUser',
        hash: '',
        search: '',
        query: {},
    },
};

export const stateEmptyUserName = setInPath('formsData.REGISTRATION.info.userName', '', stateValid);
