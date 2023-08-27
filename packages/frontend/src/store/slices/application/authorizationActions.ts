import { api } from '../../../endpoints/api.js';
import { AppThunk } from '../../../types.js';
import { authorizationReducerActions } from './authorizationSlice.js';

const ACTION_RESET_STORE = 'store/reset';

export const authorizationActions = {
    ...authorizationReducerActions,

    signOut(): AppThunk {
        return function (dispatch, getState) {
            dispatch({ type: ACTION_RESET_STORE });
            dispatch(api.util.resetApiState());
        };
    },
};
