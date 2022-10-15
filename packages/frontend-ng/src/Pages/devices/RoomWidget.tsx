import React from 'react';
import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useAppSelector } from '../../hooks';
import { Device, deviceSelectors } from '../../store/slices/application/devicesSlice';
import { getDevicesById, getThing } from '../../utils/getters';
import { Thing } from '../../store/slices/application/thingsSlice';
import { ComponentType, IThingPropertyBase } from 'common/src/models/interface/thing';
import { SimpleSensor } from './roomWidget/SimpleSensor';
import { WithRequired } from '../../types';
import { Link } from 'react-router-dom';
import { SxProps } from '@mui/material';
import { Theme } from '@mui/material';

interface SensorBadgesProps {
    thingId: Thing['_id'];
}
function SensorBadges({ thingId }: SensorBadgesProps) {
    const badges: JSX.Element[] = [];
    const thing = useAppSelector(getThing(thingId));
    if (thing?.config.componentType !== ComponentType.sensor) return badges;

    thing.config.properties.forEach((property) => {
        if (property.propertyClass)
            badges.push(
                <SimpleSensor
                    thing={thing}
                    property={property as WithRequired<IThingPropertyBase, 'propertyClass'>}
                    key={property._id}
                />
            );
    });

    return badges;
}

interface RoomWidgetProps {
    deviceIDs: Array<Device['_id']>;
    sx?: SxProps<Theme>;
}
const RoomWidget = React.forwardRef<HTMLDivElement, RoomWidgetProps>(function ({ deviceIDs, sx }, ref) {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const devices = useAppSelector(getDevicesById(deviceIDs));
    const sensorsLimit = isSmall ? 3 : 4;
    const location = devices[0].info.location;

    let sensors: (JSX.Element | null)[] = [];
    devices.forEach((device) => {
        device.things.forEach((thingId) => {
            const badges = SensorBadges({ thingId });
            sensors.push(...badges);
        });
    });
    return (
        <Paper
            elevation={3}
            ref={ref}
            sx={[
                (theme) => ({
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    [theme.breakpoints.up('md')]: { flexDirection: 'row' },
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            <Typography variant="h3" sx={{ display: 'inline-block', textAlign: 'center' }}>
                {location.room}
            </Typography>
            <Box
                sx={(theme) => ({
                    display: 'flex',
                    flexGrow: 1,
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                })}
            >
                {sensors.slice(0, sensorsLimit)}
            </Box>
        </Paper>
    );
});

export default React.forwardRef<HTMLDivElement, RoomWidgetProps & { link: string }>(function ({ link, ...props }, ref) {
    return (
        <Link to={link}>
            <RoomWidget {...props} ref={ref} />
        </Link>
    );
});
