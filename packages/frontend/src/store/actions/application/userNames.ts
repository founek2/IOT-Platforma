import { ActionTypes } from '../../../constants/redux';
import { baseLogger } from 'framework-ui/lib/logger';
import { getUsers } from 'framework-ui/lib/api/userApi';
import { getToken } from 'framework-ui/lib/utils/getters';
import { AppThunk } from '../../../types';
import { userNamesReducerActions } from '../../reducers/application/userNames';

export const userNamesActions = {
    ...userNamesReducerActions,

    fetch(): AppThunk {
        return (dispatch, getState) => {
            const EDIT_PERMISSIONS = 'EDIT_PERMISSIONS';
            baseLogger(EDIT_PERMISSIONS);

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
