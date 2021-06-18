import { prop, o, curry, compose, has, filter, equals, path } from 'ramda';
import getInPath from './getInPath';
import { AuthorizationState } from '../redux/reducers/application/authorization';

type getter = (object: any) => any;

export const getFormsData: getter = prop('formsData');

export const getFieldDescriptors: getter = prop('fieldDescriptors');

export const getFieldDescriptor = curry((deepPath, state) =>
    o((descriptors) => {
        if (deepPath.match(/\.\d+$/)) deepPath = deepPath.replace(/\.\d+$/, '[]');
        return getInPath(deepPath)(descriptors);
    }, getFieldDescriptors)(state)
);

export const getRegisteredFields: getter = o(prop('registeredFields'), getFormsData);

export const getRegisteredField = curry((deepPath, state) => o(getInPath(deepPath), getRegisteredFields)(state));

export const getPristine = compose(prop('pristine'), getRegisteredField);

export const getFormData = (formName: string) => o(prop(formName), getFormsData);

export const getFormDescriptors = curry((formName, state) => o(prop(formName), getFieldDescriptors)(state));

export const getApplication: getter = prop('application');

export const getNotifications = o(prop('notifications'), getApplication);

export const getUser: getter = o(prop('user'), getApplication);

export const getAuthorization = o(prop('authorization'), getApplication) as (state: any) => AuthorizationState;

export const getUserAuthType = o(prop('authType'), getUser);

export const getUserInfo = o(prop('info'), getUser);

export const getGroups = o(prop('groups'), getUser);

export const getFieldVal = curry((deepPath, state) => o(getInPath(deepPath), getFormsData)(state));

export const getToken = o(prop('accessToken'), getAuthorization);

// export const getUserPresence = o(Boolean, getToken);
export const isUserLoggerIn = o(prop('loggedIn'), getAuthorization);

export const getUsers: getter = o(prop('users'), getApplication);

export const getCities = o(prop('cities'), getApplication);

export const getUserId = o(prop('id'), getUser);

export const getLastPosUpdate = o(prop('lastPositionUpdate'), getUser);

export const getUsersWithPosition = o(filter(has('positions')), getUsers);

export const getHistory: getter = prop('history');

export const isUrlHash = (hash: string) => compose(equals(hash), prop('hash'), getHistory);

export const getTmpData = prop('tmpData');

export const getDialogTmp = path(['dialog', 'tmpData']);
