import { getUsers } from 'framework-ui/lib/api/userApi';
import { logger } from 'framework-ui/lib/logger';
import { getToken } from 'framework-ui/lib/utils/getters';
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
                        console.log('jsonData', json.data);
                        dispatch(userNamesActions.set(json.data));
                    },
                },
                dispatch
            );
        };
    },
};
