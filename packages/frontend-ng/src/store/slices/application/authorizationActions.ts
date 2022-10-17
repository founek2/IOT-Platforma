import { api } from '../../../services/api';
import { AppThunk } from '../../../types';
import { authorizationReducerActions } from './authorizationSlice';

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
