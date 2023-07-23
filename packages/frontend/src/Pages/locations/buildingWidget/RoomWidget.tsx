import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { useAppSelector } from '../../../hooks';
import { Device, deviceSelectors } from '../../../store/slices/application/devicesSlice';
import { getDevicesById, getThing } from '../../../selectors/getters';
import { Thing } from '../../../store/slices/application/thingsSlice';
import { ComponentType, IThingPropertyBase } from 'common/src/models/interface/thing';
import { SimpleSensor } from '../roomWidget/SimpleSensor';
import { WithRequired } from '../../../types';
import { useNavigate } from 'react-router-dom';
import type { SxProps, Theme } from '@mui/material/styles';

interface SensorBadgesProps {
    thingId: Thing['_id'];
}
function createSensorBadges({ thingId }: SensorBadgesProps) {
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
    className?: string;
}
const RoomWidget = React.forwardRef<HTMLDivElement, RoomWidgetProps>(function ({ deviceIDs, sx, className }, ref) {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const devices = useAppSelector(getDevicesById(deviceIDs));
    const sensorsLimit = isSmall ? 3 : 4;
    const location = devices[0].info.location;

    let sensors: (JSX.Element | null)[] = [];
    devices.forEach((device) => {
        device.things.forEach((thingId) => {
            const badges = createSensorBadges({ thingId });
            sensors.push(...badges);
        });
    });
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
                {sensors.slice(0, sensorsLimit)}
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
