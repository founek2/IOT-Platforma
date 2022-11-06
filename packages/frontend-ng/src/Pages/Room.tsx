import { CircularProgress, Dialog } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDevicesQuery } from '../endpoints/devices';
import { useAppSelector } from '../hooks';
import { useAppBarContext } from '../hooks/useAppBarContext';
import { getThing } from '../selectors/getters';
import Room from './room/Room';

export interface RoomProps {
    title?: string;
}
export default function RoomPage({ title }: RoomProps) {
    const { isLoading } = useDevicesQuery(undefined, { pollingInterval: 10 * 60 * 1000 });
    const [urlSearchParams] = useSearchParams();
    const selectedThing = useAppSelector(getThing(urlSearchParams.get('thingId') || ''));
    const { setAppHeader, resetAppHeader } = useAppBarContext();
    const navigate = useNavigate();

    return (
        <>
            {isLoading ? <CircularProgress /> : <Room title={title} mode="things" />}
            <Dialog open={Boolean(selectedThing)} onClose={() => navigate({ search: '' }, { replace: true })}></Dialog>
        </>
    );
}
