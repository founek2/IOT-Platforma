import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store/store';

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
