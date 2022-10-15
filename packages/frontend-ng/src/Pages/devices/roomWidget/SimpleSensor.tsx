import { Box, Typography } from '@mui/material';
import { IThingProperty } from 'common/src/models/interface/thing';
import React from 'react';
import { SensorIcons } from '../../../components/sensorIcons';
import { Thing } from '../../../store/slices/application/thingsSlice';

type IThingPropertyWithDeviceClass = IThingProperty & { propertyClass: NonNullable<IThingProperty['propertyClass']> };
interface SimpleSensorProps {
    thing: Thing;
    property: IThingPropertyWithDeviceClass;
}
export function SimpleSensor({ thing, property }: SimpleSensorProps) {
    const Icon = SensorIcons[property.propertyClass];

    const value = thing.state?.value && thing.state?.value[property.propertyId];

    if (!value) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Icon />
            <Typography component="span">
                {value}&nbsp;{property.unitOfMeasurement}
            </Typography>
        </Box>
    );
}
