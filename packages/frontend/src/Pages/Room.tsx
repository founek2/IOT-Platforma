import React from "react"
import { useDevicesQuery } from '../endpoints/devices.js';
import Room from './room/Room.js';
import { ThingDialog } from './room/ThingDialog.js';
import { CircularProgress } from "@mui/material";

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
