import { getAuthChallenge as getAuthChallengeApi } from '../../../api/authApi'


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