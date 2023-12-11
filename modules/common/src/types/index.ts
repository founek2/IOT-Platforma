import { CONTROL_TYPES } from '../constants';
import { IDevice } from '../models/interface/device';
import { IThing, PropertyState } from '../models/interface/thing';
import { IUser, Permission } from '../models/interface/userInterface';
import type { Request } from 'express';
import { JwtService } from '../services/jwtService';
import { UserService } from '../services/userService';

export interface Config {
    port: number;
    bodyLimit: string;
    homepage: string;
    portAuth: number;
    portMqtt: number;
    serviceMqttUri: string;
    serviceAuthUri: string;
    firebaseAdminPath: string;
    dbUri: string;
    influxDb: {
        url: string;
        apiKey: string;
        organization: string;
        bucket: string;
    };
    jwt: {
        privateKey: string;
        publicKey: string;
        expiresIn: string;
    };
    notification: {
        vapidPrivateKey: string
        vapidPublicKey: string
    }
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
    mqtt: {
        url: string;
        port: number;
        managementPort: number;
    };
    oauth: {
        seznam: {
            clientSecret?: string;
            clientId?: string;
            iconUrl: string;
            endpoint: string;
            scopes: string[];
        };
    };
}

export type FormType<T> = { JSONkey: string } & T;
export type ControlState = { state: any; updatedAt: string } | null;
export type ControlRecipe = {
    name: string;
    type: CONTROL_TYPES;
    JSONkey: string;
    description?: string | null;
    ipAddress?: string;
    metadata?: { [key: string]: any };
};
export type StateUpdate = any;

export type ChangeHandler<T = any> = (
    form: FormType<T>,
    currentState: ControlState,
    recipe: ControlRecipe
) => Promise<StateUpdate>;

export type AckHandler = (recipe: ControlRecipe) => Promise<boolean>;

export type SocketUpdateThingState = {
    _id: IDevice['_id'];
    thing: {
        _id: IThing['_id'];
        nodeId: IThing['config']['nodeId'];
        state: { [propertyId: string]: PropertyState };
    };
};
type Dict = { [key: string]: any };
export type RequestWithAuth<P = {}, ReqQuery = {}> = Request<P, any, any, ReqQuery> & {
    user: Pick<IUser, "_id" | "groups"> & { admin?: boolean; accessPermissions?: Permission[], refreshTokenId?: string };
    root?: boolean;
};

export type RequestWithAuthOpt<P = Dict> = Request<P> & {
    user?: IUser & { admin?: boolean; accessPermissions?: Permission[] };
    root?: boolean;
};

export type Measurement = {
    _table: number;
    _field: 'value_float' | 'value_int' | 'value_bool' | 'value_string';
    _value: number | boolean | string;
    _start: Date;
    _stop: Date;
    _time: Date;
    deviceId: string;
    deviceName: string;
    propertyId: string;
    thingId: string;
};

export type MeasurementNumber = Measurement & {
    _field: 'value_float' | 'value_int';
    _value: number;
};

export type MeasurementBool = Measurement & {
    _field: 'value_bool' | 'value_int';
    _value: boolean;
};

export type MeasurementString = Measurement & {
    _field: 'value_string';
    _value: string;
};

export type HasContext = {
    context: {
        jwtService: JwtService
        userService: UserService
    }
}