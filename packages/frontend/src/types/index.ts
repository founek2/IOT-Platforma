import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store/store';
import { IThing } from 'common/src/models/interface/thing';
import { IDevice } from 'common/src/models/interface/device';

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
export type Locations = Map<string, Set<string>>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
