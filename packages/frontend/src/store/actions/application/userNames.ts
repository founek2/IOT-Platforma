import { logger } from 'framework-ui/src/logger';
import { getToken } from 'framework-ui/src/utils/getters';
import { getUsers } from 'src/api/userApi';
import { AppThunk } from '../../../types';
import { userNamesReducerActions } from '../../reducers/application/userNames';

export const userNamesActions = {
    ...userNamesReducerActions,

    fetch(): AppThunk {
        return (dispatch, getState) => {
            const EDIT_PERMISSIONS = 'EDIT_PERMISSIONS';
            logger.info(EDIT_PERMISSIONS);

            return getUsers(
                {
                    params: {
                        type: 'userName',
                    },
                    token: getToken(getState()),
                    onSuccess: (json: any) => {
                        dispatch(userNamesActions.set(json.data));
                    },
                },
                dispatch
            );
        };
    },
};
