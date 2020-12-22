import { getAuthChallenge as getAuthChallengeApi } from '../../../api/authApi'
import { updateUserNoMessage as updateUserNoMessageApi } from '../../../api/userApi'
import { updateUser as updateUserApi } from 'framework-ui/lib/api/userApi'
import { getUserId, getToken } from 'framework-ui/lib/utils/getters';
import { baseLogger } from 'framework-ui/lib/logger'
import { addNotification } from 'framework-ui/lib/redux/actions/application/notifications'
import ErrorMessages from 'framework-ui/lib/localization/errorMessages'

export function getAuthChallenge() {
    return function (dispatch) {

        return getAuthChallengeApi(
            {
                onSuccess: (json) => {
                    return json;
                }
            },
            dispatch
        )
    }
}

export function registerToken(token) {
    return function (dispatch, getState) {
        const FIREBASE_ADD = "FIREBASE_ADD"
        baseLogger(FIREBASE_ADD)

        if (!token) return dispatch(addNotification({ message: ErrorMessages.getMessage('notificationsDisabled'), variant: 'error', duration: 3000 }))

        const state = getState()
        return updateUserNoMessageApi({
            id: getUserId(state),
            token: getToken(state),
            body: { formData: { [FIREBASE_ADD]: { token } } }
        }, dispatch)
    }
}

export default {
    getAuthChallenge
}