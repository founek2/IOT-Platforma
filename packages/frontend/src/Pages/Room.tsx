import React from "react"
import CircularProgress from '@mui/material/CircularProgress';
import { useDevicesQuery } from '../endpoints/devices';
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
