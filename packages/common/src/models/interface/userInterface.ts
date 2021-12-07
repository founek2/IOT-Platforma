import { AuthType } from '../../constants';

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

export enum OAuthProvider {
    seznam = 'seznam',
}

export interface IOauth {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    tokenType: string;
    provider: OAuthProvider;
}

export interface IUser {
    _id?: any;
    info: {
        userName: string;
        firstName?: string;
        lastName?: string;
        email: string;
    };
    auth: {
        types: AuthType[];
        password?: string;
        oauth?: IOauth;
    };
    realm: string;
    groups: string[];
    notifyTokens: string[];
    accessTokens?: IAccessToken[];
    createdAt: Date;
    updatedAt: Date;
}
