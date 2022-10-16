import type { SxProps, Theme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import React from 'react';
import { useAppSelector } from '../../hooks/index';
import { getThing } from '../../selectors/getters';

interface ThingWidgetProps {
    id: string;
    sx?: SxProps<Theme>;
    className?: string;
}
export const ThingWidget = React.forwardRef<HTMLDivElement, ThingWidgetProps>(({ id, sx, className }, ref) => {
    const thing = useAppSelector(getThing(id));
    if (!thing) return null;

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
            <Typography
                sx={{
                    overflow: 'hidden',
                    textAlign: 'center',
                    cursor: 'pointer',
                    paddingTop: 1,
                    paddingBottom: 1,
                }}
            >
                {thing.config.name}
            </Typography>
        </Paper>
    );
});
