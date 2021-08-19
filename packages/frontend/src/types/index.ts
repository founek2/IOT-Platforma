import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store/store';
import { IThing } from 'common/lib/models/interface/thing';
import { IDevice } from 'common/lib/models/interface/device';

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

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
