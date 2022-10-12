import { logger } from 'common/src/logger';
import { persistor } from '../..';
import { AppThunk } from '../../../types';
import { authorizationReducerActions } from './authorizationSlice';

const ACTION_RESET_STORE = 'store/reset';

export const authorizationActions = {
    ...authorizationReducerActions,

    signOut(): AppThunk {
        return function (dispatch, getState) {
            dispatch({ type: ACTION_RESET_STORE });
        };
    },
};
