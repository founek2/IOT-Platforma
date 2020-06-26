import fieldDescriptors from 'frontend/src/validations/fieldDescriptors.js'
import setInPath from 'framework-ui/src/utils/setInPath'

export const stateValid = {
    application: {
        user: {},
        notifications: {},
        users: [],
        devices: {
            data: []
        }
    },
    formsData: {
        registeredFields: {
            REGISTRATION: {
                info: {
                    firstName: {
                        valid: true,
                        pristine: false,
                        errorMessages: []
                    },
                    lastName: {
                        valid: true,
                        pristine: false,
                        errorMessages: []
                    },
                    userName: {
                        valid: true,
                        pristine: false,
                        errorMessages: []
                    },
                    email: {
                        valid: true,
                        pristine: true
                    }
                },
                auth: {
                    password: {
                        valid: true,
                        pristine: false,
                        errorMessages: []
                    },
                    type: {
                        valid: true,
                        pristine: true
                    }
                }
            }
        },
        REGISTRATION: {
            info: {
                firstName: 'Martin',
                lastName: 'Skalický',
                userName: 'skalima'
            },
            auth: {
                password: '123456'
            }
        }
    },
    fieldDescriptors,
    tmpData: {
        dialog: {}
    },
    history: {
        pathname: '/registerUser',
        hash: '',
        search: '',
        query: {}
    }
}

export const stateInvalidPassword = {
    application: {
        user: {},
        notifications: {},
        users: [],
        devices: {
            data: []
        }
    },
    formsData: {
        registeredFields: {
            REGISTRATION: {
                info: {
                    firstName: {
                        valid: true,
                        pristine: false,
                        errorMessages: []
                    },
                    lastName: {
                        valid: true,
                        pristine: false,
                        errorMessages: []
                    },
                    userName: {
                        valid: true,
                        pristine: false,
                        errorMessages: []
                    },
                    email: {
                        valid: true,
                        pristine: true
                    }
                },
                auth: {
                    password: {
                        valid: true,
                        pristine: false,
                    },
                    type: {
                        valid: true,
                        pristine: true
                    }
                }
            }
        },
        REGISTRATION: {
            info: {
                firstName: 'Martin',
                lastName: 'Skalický',
                userName: 'skalima'
            },
            auth: {
                password: '123'
            }
        }
    },
    fieldDescriptors,
    tmpData: {
        dialog: {}
    },
    history: {
        pathname: '/registerUser',
        hash: '',
        search: '',
        query: {}
    }
}

export const stateEmptyUserName = setInPath("formsData.REGISTRATION.info.userName", "", stateValid)