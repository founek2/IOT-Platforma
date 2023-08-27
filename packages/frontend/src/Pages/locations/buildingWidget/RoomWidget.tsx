import React from 'react';
import { useAppSelector } from '../../../hooks/index.js';
import { Device } from '../../../store/slices/application/devicesSlice.js';
import { getDevicesById, getThingsById } from '../../../selectors/getters.js';
import { Thing } from '../../../store/slices/application/thingsSlice.js';
import { ComponentType, IThingProperty, IThingPropertyBase } from 'common/src/models/interface/thing.js';
import { SimpleSensor } from '../roomWidget/SimpleSensor.js';
import { WithRequired } from '../../../types.js';
import { useNavigate } from 'react-router-dom';
import type { SxProps, Theme } from '@mui/material/styles';
import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';

function createSensorBadge(value: any, property: IThingProperty) {
    return <SimpleSensor
        value={value}
        property={property as WithRequired<IThingPropertyBase, 'propertyClass'>}
        key={property._id}
    />
}

function pickAllSensors(thing: Thing) {
    if (thing?.config.componentType !== ComponentType.sensor) return [];

    return thing.config.properties.filter((property) => property.propertyClass).map(property => ({ value: thing.state?.[property.propertyId]?.value, property }));
}

interface RoomWidgetProps {
    deviceIDs: Array<Device['_id']>;
    sx?: SxProps<Theme>;
    className?: string;
}
const RoomWidget = React.forwardRef<HTMLDivElement, RoomWidgetProps>(function ({ deviceIDs, sx, className }, ref) {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const devices = useAppSelector(getDevicesById(deviceIDs));
    const things = useAppSelector(getThingsById(devices.flatMap(device => device.things)));
    const sensorsLimit = isSmall ? 3 : 4;
    const location = devices[0].info.location;

    let sensors = things
        .filter(thing => thing?.config.componentType === ComponentType.sensor)
        .flatMap(pickAllSensors)
        .slice(0, sensorsLimit)
        .map(({ value, property }) => createSensorBadge(value, property))

    return (
        <Paper
            elevation={3}
            ref={ref}
            className={className}
            sx={[
                (theme) => ({
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    [theme.breakpoints.up('md')]: { flexDirection: 'row' },
                    cursor: "pointer"
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            <Typography variant="h3" sx={{ display: 'inline-block', textAlign: 'center' }}>
                {location.room}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                }}
            >
                {sensors}
            </Box>
        </Paper>
    );
});

export default React.forwardRef<HTMLDivElement, RoomWidgetProps & { link: string }>(function ({ link, ...props }, ref) {
    const navigate = useNavigate();

    return (
        // Link did not work in Firefox, because <a> is draggable by native browser
        <div onClick={() => navigate(link)}>
            <RoomWidget {...props} ref={ref} />
        </div>
    );
});
