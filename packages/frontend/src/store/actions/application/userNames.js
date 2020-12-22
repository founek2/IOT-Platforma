import { ActionTypes } from '../../../constants/redux'
import { baseLogger } from 'framework-ui/lib/Logger'
import { getUsers } from 'framework-ui/lib/api/userApi'
import { getToken } from 'framework-ui/lib/utils/getters'

export function set(data) {
    baseLogger("SET_USER_NAMES")
    return {
        type: ActionTypes.SET_USER_NAMES,
        payload: data
    }
}

export function fetch() {
    return (dispatch, getState) => {
        const EDIT_PERMISSIONS = "EDIT_PERMISSIONS"
        baseLogger(EDIT_PERMISSIONS)

        return getUsers({
            params: {
                type: "userName"
            },
            token: getToken(getState()),
            onSuccess: (json) => {
                dispatch(set(json.data))
            }
        }, dispatch)
    }
}