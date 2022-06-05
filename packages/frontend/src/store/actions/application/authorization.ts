import { logger } from 'framework-ui/src/logger';
import { dehydrateState } from 'framework-ui/src/redux/actions';
import { userActions } from 'framework-ui/src/redux/actions/application/user';
import { authorizationReducerActions } from 'framework-ui/src/redux/reducers/application/authorization';
import { AppThunk } from 'frontend/src/types';
import { postAuthorization } from '../../../api/authorization';

export const authorizationActions = {
    ...authorizationReducerActions,

    sendCode(code: string, redirectUri: string): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const AUTHORIZATION = 'AUTHORIZATION';
            logger.info(AUTHORIZATION);

            return postAuthorization(
                {
                    body: { formData: { [AUTHORIZATION]: { code, redirectUri } } },
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
