import { Action, ThunkAction } from '@reduxjs/toolkit';
import { AuthorizationState } from '../redux/reducers/application/authorization';
import { NotificationsState } from '../redux/reducers/application/notifications';
import { HistoryState } from '../redux/reducers/history';

export type errorMessage = string;

export type validationFn = (value: any, options?: any) => true | errorMessage;

export type messages = { [messageKey: string]: ((args: any) => string) | string };

export type FieldDescriptor = {
    deepPath: string;
    required?: boolean;
    when?: ((formData: any, options: { deepPath: string; i?: number }) => boolean) | null;
    getLength?: ((formData: any) => number | undefined) | null | undefined; // just when deepPath ends with [] -> will be array of fields
    label?: string | null | undefined;
    name?: string | null | undefined;
    validations?: Array<validationFn>;
};

export type FieldState = {
    pristine: boolean;
    valid: boolean;
    errorMessages?: Array<string>;
};

export type FormRegisteredFields = { [key: string]: FieldState | FormRegisteredFields };
export type RegisteredFields = { [formName: string]: FormRegisteredFields };

export type FormFieldDescriptors = { [fieldPath: string]: FormFieldDescriptors | FieldDescriptor };
export type FieldDescriptors = { [formName: string]: { [name: string]: FormFieldDescriptors | FieldDescriptor } };

export type FormData = { [formName: string]: any };
export type formsData = {
    registeredFields: RegisteredFields;
    [formName: string]: any;
};

export type ValueOf<T> = T[keyof T];

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, any, unknown, Action>;

export type NotificationVariant = 'default' | 'error' | 'success' | 'warning' | 'info' | undefined;

export type Application = {
    notifications: NotificationsState;
    authorization: AuthorizationState;
};
export type State = {
    application: Application;
    formsData: formsData;
    history: HistoryState;
    fieldDescriptors: FieldDescriptors;
};
