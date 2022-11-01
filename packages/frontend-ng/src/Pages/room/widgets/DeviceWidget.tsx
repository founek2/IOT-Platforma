import type { SxProps, Theme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import React from 'react';
import { useAppSelector } from '../../../hooks/index';
import { getDevice, getThing } from '../../../selectors/getters';
import { Link } from 'react-router-dom';

interface ThingWidgetProps {
    id: string;
    sx?: SxProps<Theme>;
    className?: string;
}
export const DeviceWidget = React.forwardRef<HTMLDivElement, ThingWidgetProps>(({ id, sx, className }, ref) => {
    const device = useAppSelector(getDevice(id));
    if (!device) return null;

    return (
        <Paper
            className={className}
            elevation={2}
            sx={[
                {
                    padding: 3,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            ref={ref}
        >
            <Link to={{ search: `deviceId=${device._id}` }}>
                <Typography
                    sx={{
                        overflow: 'hidden',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                    }}
                >
                    {device.info.name}
                </Typography>
            </Link>
        </Paper>
    );
});
