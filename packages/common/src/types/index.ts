import { CONTROL_TYPES } from '../constants';
import { IDevice } from '../models/interface/device';
import { IThing } from '../models/interface/thing';
import { IUser, Permission } from '../models/interface/userInterface';

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
    email:
        | {
              host: string;
              port: number;
              secure: boolean;
              userName: string;
              password: string;
          }
        | undefined;
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
        state: {
            value: { [propertyId: string]: string | number };
            timestamp: Date;
        };
    };
};

export type RequestWithAuth = Request & {
    user: IUser & { admin?: boolean; accessPermissions?: Permission[] };
    root?: boolean;
};
