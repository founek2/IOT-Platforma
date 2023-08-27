import { IThingProperty } from 'common/src/models/interface/thing.js';
import React from 'react';
import { SensorIcons } from '../../../constants/sensorIcons.js';
import { Box, Typography } from '@mui/material';

type IThingPropertyWithDeviceClass = IThingProperty & { propertyClass: NonNullable<IThingProperty['propertyClass']> };
interface SimpleSensorProps {
    value: any;
    property: IThingPropertyWithDeviceClass;
}
export function SimpleSensor({ value, property }: SimpleSensorProps) {
    const Icon = SensorIcons[property.propertyClass];

    if (!value) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: "0.3rem",
                paddingRight: "0.3rem"
            }}
        >
            <Icon />
            <Typography component="span">
                {value}&nbsp;{property.unitOfMeasurement}
            </Typography>
        </Box>
    );
}
