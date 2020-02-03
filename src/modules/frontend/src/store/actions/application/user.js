import {validateRegisteredFields, resetForm} from 'framework-ui/src/redux/actions/formsData'
import {update} from 'framework-ui/src/redux/actions/application/user'
import {getFormData} from 'framework-ui/src/utils/getters'
import {patchUser as patchUserApi} from 'framework-ui/src/api/userApi'
import {dehydrateState} from 'framework-ui/src/redux/actions'

// TODO maybe trash?
export function editDeviceUser(userId) {
    return function(dispatch, getState) {
         const EDIT_DEVICE_USER = 'EDIT_DEVICE_USER'
         const result = dispatch(validateRegisteredFields(EDIT_DEVICE_USER)())
         if (result.valid) {
              const formData = getFormData(EDIT_DEVICE_USER)(getState())
              return patchUserApi(
                   {
                        body: { formData: { [EDIT_DEVICE_USER]: formData } },
                        id: userId,
                        onSuccess: () => {
                             dispatch(resetForm(EDIT_DEVICE_USER)())
                         //     dispatch(update({deviceUser: {userName: formData.userName }}))
                             dispatch(dehydrateState())
                        }
                   },
                   dispatch
              )
         }
    }
}

export default {
    editDeviceUser
}