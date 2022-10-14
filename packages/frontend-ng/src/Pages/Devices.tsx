import { Paper } from '@mui/material';
import React from 'react';
import { Background } from '../components/Background';
import { useDevicesQuery } from '../services/devices';

const HOUR_1 = 60 * 60 * 1000;

export default function Devices() {
    const { data } = useDevicesQuery(undefined, { pollingInterval: HOUR_1 });
    console.log('data', data);
    return <Background>sdasdad</Background>;
}
