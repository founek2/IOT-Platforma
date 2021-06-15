import { IDevice } from 'common/lib/models/interface/device';
import { IDiscovery } from 'common/lib/models/interface/discovery';
import { HistoricalSensor, HistoricalGeneric } from 'common/lib/models/interface/history';
import { IThing } from 'common/lib/models/interface/thing';
import { IUser, IAccessToken } from 'common/lib/models/interface/userInterface';
import { fieldState } from 'framework-ui/lib/types';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

export interface ControlProps {
    name: string;
    description: string;
    onClick: React.ChangeEvent<any>;
    data: any;
    ackTime: Date;
    afk: boolean;
    pending: boolean;
    forceUpdate: React.ChangeEventHandler;
}

export interface IState {
    accessTokens: { data: IAccessToken[]; lastFetch?: Date; lastUpdate?: Date };
    application: {
        user?: IUser;
        notifications: any[];
        users: any[];
        devices: { data: IDevice[]; lastFetch?: Date; lastUpdate?: Date };
        discovery: { data: IDiscovery[]; lastFetch?: Date; lastUpdate?: Date };
        thingHistory: {
            data: HistoricalSensor[] | HistoricalGeneric[];
            deviceId?: IDevice['_id'];
            thingId?: IThing['_id'];
            lastFetch?: Date;
        };
        userNames: { data: Array<{ _id: string; userName: string }>; lastFetch?: Date; lastUpdate?: Date };
    };
    formsData: {
        registeredFields: { [deepPath: string]: fieldState };
        [formName: string]: any;
    };
    fieldDescriptors: any;
    tmpData: {
        dialog: {};
    };
    history: {
        pathName: string;
        hash: string;
        search: string;
        query: { [key: string]: string };
    };
}

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, IState, unknown, AnyAction>;
