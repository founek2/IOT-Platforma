import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dialog } from '../components/Dialog';
import { useDevicesQuery } from '../endpoints/devices';
import { useLazyThingHistoryQuery, useUpdateThingStateMutation } from '../endpoints/thing';
import { useAppSelector } from '../hooks';
import { useAppBarContext } from '../hooks/useAppBarContext';
import { ThingContext } from '../hooks/useThing';
import { getThing } from '../selectors/getters';
import PropertyRow from './room/PropertyRow';
import Room from './room/Room';
import { ThingDialog } from './room/ThingDialog';

export interface RoomProps {
    title?: string;
}
export default function RoomPage({ title }: RoomProps) {
    const { isLoading } = useDevicesQuery(undefined, { pollingInterval: 10 * 60 * 1000 });

    return (
        <>
            {isLoading ? <CircularProgress /> : <Room title={title} mode="things" />}
            <ThingDialog />
        </>
    );
}
