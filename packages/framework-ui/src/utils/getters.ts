import { compose, curry, equals, o, prop } from 'ramda';
import { AuthorizationState } from '../redux/reducers/application/authorization';
import { FieldDescriptor, FieldDescriptors, FieldState, formsData, RegisteredFields, State } from '../types';
import getInPath from './getInPath';

export const getFormsData = (state: State) => state.formsData;

export const getFieldDescriptors = (state: State) => state.fieldDescriptors;

export const getFieldDescriptor = curry((deepPath: string, state: State) =>
    o((descriptors) => {
        if (deepPath.match(/\.\d+$/)) deepPath = deepPath.replace(/\.\d+$/, '[]');
        return getInPath<[any], [any], FieldDescriptor | undefined>(deepPath)(descriptors);
    }, getFieldDescriptors)(state)
);

export const getRegisteredFields = o<State, formsData, RegisteredFields>(prop('registeredFields'), getFormsData);

export const getRegisteredField = curry((deepPath: string, state: State) =>
    o<State, RegisteredFields, FieldState>(getInPath(deepPath), getRegisteredFields)(state)
);

export const getPristine = compose<string, State, FieldState, boolean>(prop('pristine'), getRegisteredField);

export const getFormData = <T extends State>(formName: string) => o<T, formsData, any>(prop(formName), getFormsData);

export const getFormDescriptors = curry((formName: string, state: State) =>
    o(prop(formName), getFieldDescriptors)(state)
);

export const getApplication = (state: State) => state.application;

export const getNotifications = o(prop('notifications'), getApplication);

export const getAuthorization = o(prop('authorization'), getApplication) as (state: any) => AuthorizationState;

// export const getUserAuthType = o(prop('authType'), getUser);

// export const getUserInfo = o(prop('info'), getUser);

// export const getGroups = o(prop('groups'), getUser);

export const getFieldVal = curry((deepPath, state) => o(getInPath(deepPath), getFormsData)(state));

export const getToken = o(prop('accessToken'), getAuthorization);

// export const getUserPresence = o(Boolean, getToken);
export const isUserLoggerIn = o(prop('loggedIn'), getAuthorization);

export const getHistory: (state: State) => State['history'] = prop('history');

export const isUrlHash = (hash: string) => compose(equals(hash), prop('hash'), getHistory);

// export const getTmpData = prop('tmpData');

// export const getDialogTmp = path(['dialog', 'tmpData']);
