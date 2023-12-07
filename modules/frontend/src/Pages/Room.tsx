import React from "react"
import CircularProgress from '@mui/material/CircularProgress';
import { useDevicesQuery } from '../endpoints/devices';
import Room from './room/Room';
import { ThingDialog } from './room/ThingDialog';
import { RoomLoader } from "./Room.loader";

export interface RoomProps {
    title?: string;
}
export default function RoomPage({ title }: RoomProps) {
    const { isLoading } = useDevicesQuery(undefined, { pollingInterval: 10 * 60 * 1000 });

    return (
        <>
            {isLoading ? <RoomLoader /> : <Room title={title} />}
            <ThingDialog />
        </>
    );
}
