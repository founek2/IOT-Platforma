import { AuthTypes } from '../../constants';

export enum Permission {
    read = 'read',
    write = 'write',
    control = 'control',
}
export interface IAccessToken {
    _id?: any;
    token: String;
    name: String;
    permissions: Permission[];
    createdAt: Date;
    validTo?: Date;
}

export interface IUser {
    _id?: any;
    info: {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
    };
    auth: {
        type: AuthTypes;
        password: string;
    };
    realm: string;
    groups: string[];
    notifyTokens: string[];
    accessTokens?: IAccessToken[];
    createdAt: Date;
    updatedAt: Date;
}
