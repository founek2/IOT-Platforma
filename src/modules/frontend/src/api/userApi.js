import { putJson } from 'framework-ui/src/api'

export const API_URL = '/api'

export const updateUserNoMessage = ({ id, ...object }, dispatch) => {
    putJson({
        url: API_URL + `/user/${id}`,
        ...object,
        // successMessage: 'userUpdated',
        dispatch
    })
}