import { validateRegisteredFields, resetForm } from 'framework-ui/src/redux/actions/formsData'
import { update } from 'framework-ui/src/redux/actions/application/user'
import { getFormData } from 'framework-ui/src/utils/getters'
import { getAuthChallenge as getAuthChallengeApi } from '../../../api/authApi'
import { dehydrateState } from 'framework-ui/src/redux/actions'


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

export default {
     getAuthChallenge
}