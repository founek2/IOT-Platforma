import { ControlRecipe } from 'common/lib/types';
import type { Request } from 'express';
import { IUser, Permission } from 'common/lib/models/interface/userInterface';

export interface EmitterEvents {
    user_login: any;
    user_signup: UserBasic;
    user_forgot: { email: IUser['info']['email'] };
    device_control_recipe_change: { recipes: ControlRecipe[]; deviceId: string };
    device_delete: string;
    device_create: string;
    devices_delete: string[];
}

export interface UserBasic {
    id: string;
    info: {
        firstName: string;
        email: string;
        lastName: string;
        userName: string;
    };
}

export interface Config {
    port: number;
    bodyLimit: string;
    homepage: string;
    portAuth: number;
    dbUri: string;
    jwt: {
        privateKey: string;
        publicKey: string;
        expiresIn: string;
    };
    testUser: string;
    testPassword: string;
    email?: {
        host: string;
        port: number;
        secure: boolean;
        userName: string;
        password: string;
    };
    agenda: {
        collection: string;
        jobs?: string;
    };
}

export type RequestWithAuthOpt = Request & {
    user?: IUser & { admin?: boolean; accessPermissions?: Permission[] };
    root?: boolean;
};

export type RequestWithAuth = Request & {
    user: IUser & { admin?: boolean; accessPermissions?: Permission[] };
    root?: boolean;
};
