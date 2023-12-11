import { api } from '../../../endpoints/api';
import internalStorage from '../../../services/internalStorage';
import { AppThunk } from '../../../types';
import { authorizationReducerActions } from './authorizationSlice';

const ACTION_RESET_STORE = 'store/reset';

export const authorizationActions = {
    ...authorizationReducerActions,

    signOut(): AppThunk {
        return function (dispatch, getState) {
            dispatch({ type: ACTION_RESET_STORE });
            internalStorage.deleteAccessToken()
            dispatch(api.util.resetApiState());
        };
    },
};
