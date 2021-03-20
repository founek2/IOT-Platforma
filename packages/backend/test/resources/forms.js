export const registration_form_test10 = {
    "REGISTRATION": {
        "info": {
            "firstName": "Vrchní",
            "lastName": "Prchnul",
            "userName": "test10"
        },
        "auth": { "password": "123456" }
    }
}

export const registration_form_no_username = {

        "REGISTRATION": {
            "info": {
                "firstName": "Vrchní",
                "lastName": "Prchnul",
            },
            "auth": { "password": "123456" }
        }
    
}

export const registration_form_extra_field = {

        REGISTRATION: {
            ...registration_form_test10.REGISTRATION,
            hobby: "Plaing on computer"
        }
    
}
