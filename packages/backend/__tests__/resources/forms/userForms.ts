const registration_form_test10 = {
    formData: {
        REGISTRATION: {
            info: {
                firstName: 'Vrchní',
                lastName: 'Prchnul',
                userName: 'test10',
                email: 'vrchni@example.com',
            },
            auth: { password: '123456' },
        },
    },
};

const registration_form_no_username = {
    formData: {
        REGISTRATION: {
            info: {
                firstName: 'Vrchní',
                lastName: 'Prchnul',
                email: 'vrchni@neco.com',
            },
            auth: { password: '123456' },
        },
    },
};

const registration_form_extra_field = {
    formData: {
        REGISTRATION: {
            ...registration_form_test10.formData.REGISTRATION,
            hobby: 'Plaing on computer',
        },
    },
};

const user_management_selected = (id: string) => ({
    formData: { USER_MANAGEMENT: { selected: [id] } },
});

const login = (userName: string, passwd: string) => ({
    formData: { LOGIN: { userName: userName, authType: 'passwd', password: passwd } },
});

const update_user_test10_lastName = {
    formData: {
        EDIT_USER: {
            info: { ...registration_form_test10.formData.REGISTRATION.info, lastName: 'Změna' },
            groups: ['user'],
        },
    },
};

const add_firebase_token = {
    formData: {
        FIREBASE_ADD: {
            token: 'Dasd24HJKhdasddasd.dasdhJK4H24JKHjkdhaskjdhjkěčhšěkjšhJK34H3JKH4KJDHkjasd.dasdas43dasd4242Dsadasdada',
        },
    },
};

export default {
    registration_form_test10,
    registration_form_no_username,
    registration_form_extra_field,
    user_management_selected,
    login,
    update_user_test10_lastName,
    add_firebase_token,
};
