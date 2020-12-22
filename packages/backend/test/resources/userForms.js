const registration_form_test10 = {
    "formData": {
        "REGISTRATION": {
            "info": {
                "firstName": "Vrchní",
                "lastName": "Prchnul",
                "userName": "test10"
            },
            "auth": { "password": "123456" }
        }
    }
}

const registration_form_no_username = {
    "formData": {
        "REGISTRATION": {
            "info": {
                "firstName": "Vrchní",
                "lastName": "Prchnul",
            },
            "auth": { "password": "123456" }
        }
    }
}

const registration_form_extra_field = {
    formData: {
        REGISTRATION: {
            ...registration_form_test10.formData.REGISTRATION,
            hobby: "Plaing on computer"
        }
    }
}

const user_management_selected = (id) => ({
    "formData": { "USER_MANAGEMENT": { "selected": [id] } }
})

const login = (userName, passwd) => ({
    "formData": { "LOGIN": { "userName": userName, "authType": "passwd", "password": passwd } }
})

const update_user_test10_lastName =  {
    "formData": { "EDIT_USER": { "info": { "firstName": "Vrchní", "lastName": "Kokot", "userName": "test10" }, "groups": ["user"], "auth": { "type": "passwd" } } }
}

module.exports = {
    registration_form_test10,
    registration_form_no_username,
    registration_form_extra_field,
    user_management_selected,
    login,
    update_user_test10_lastName
}