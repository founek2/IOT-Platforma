import { authorizationReducerActions } from 'framework-ui/lib/redux/reducers/application/authorization';
import { AppThunk } from 'frontend/src/types';
import { baseLogger } from 'framework-ui/lib/logger';
import { formsDataActions } from 'framework-ui/lib/redux/actions/formsData';
import { getFormData } from 'framework-ui/lib/utils/getters';
import { postAuthorization } from '../../../api/authorization';
import { userActions } from 'framework-ui/lib/redux/actions/application/user';
import { dehydrateState } from 'framework-ui/lib/redux/actions';

export const authorizationActions = {
    ...authorizationReducerActions,

    sendCode(code: string): AppThunk<Promise<boolean>> {
        return async function (dispatch, getState) {
            const AUTHORIZATION = 'AUTHORIZATION';
            baseLogger(AUTHORIZATION);

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
