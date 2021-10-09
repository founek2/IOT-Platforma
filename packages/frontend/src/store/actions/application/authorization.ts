import { logger } from 'framework-ui/lib/logger';
import { dehydrateState } from 'framework-ui/lib/redux/actions';
import { userActions } from 'framework-ui/lib/redux/actions/application/user';
import { authorizationReducerActions } from 'framework-ui/lib/redux/reducers/application/authorization';
import { AppThunk } from 'frontend/src/types';
import { postAuthorization } from '../../../api/authorization';

export const authorizationActions = {
    ...authorizationReducerActions,

    sendCode(code: string): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const AUTHORIZATION = 'AUTHORIZATION';
            logger.info(AUTHORIZATION);

            return postAuthorization(
                {
                    body: { formData: { [AUTHORIZATION]: { code } } },
                    onSuccess: (json: any) => {
                        dispatch(userActions.set(json.user));
                        dispatch(authorizationActions.setAccessToken(json.token));
                        dispatch(authorizationActions.setLoggedIn(true));
                        dispatch(dehydrateState());
                    },
                },
                dispatch
            );
        };
    },
};
