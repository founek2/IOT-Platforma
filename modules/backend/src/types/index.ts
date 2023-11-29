import { ControlRecipe } from 'common/lib/types';
import type { Request } from 'express';
import { IUser, Permission } from 'common/lib/models/interface/userInterface';
import { JwtService } from 'common/lib/services/jwtService';
import { UserService } from 'common/lib/services/userService';
import { MailerService } from '../services/mailerService';
import { Actions } from '../services/actionsService';
import { BrokerService } from '../services/brokerService';

export interface EmitterEvents {
    user_login: IUser;
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
        firstName?: string;
        email: string;
        lastName?: string;
        userName: string;
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

export type Context = {
    jwtService: JwtService
    userService: UserService
    mailerService: MailerService
    actionsService: Actions
    brokerService: BrokerService
}

export type HasContext = {
    context: Context
}