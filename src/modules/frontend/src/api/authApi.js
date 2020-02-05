import { getJson, putJson } from 'framework-ui/src/api'

const API_URL = '/api'

export const getAuthChallenge = () =>
    fetch(API_URL + `/auth/challenge`).then(res => res.json())

export const putChallenge = ( object , dispatch) =>
    putJson({
         url: API_URL + `/auth/challenge`,
         ...object,
         successMessage: 'webAuthSaved',
         dispatch
    })