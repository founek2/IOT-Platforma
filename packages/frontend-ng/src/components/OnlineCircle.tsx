import { DeviceStatus, IDeviceStatus } from 'common/src/models/interface/device';
import React, { useState } from 'react';
import getCircleColor, { CircleColors, getCircleTooltipText } from '../utils/getCircleColor';
import { format } from '../utils/date-fns';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps, Theme } from '@mui/system';

const colors = {
    green: 'initial',
    red: '#cd0000',
    orange: '#e08d0f',
    grey: grey[400],
};

type CircleComponentProps = {
    color: CircleColors;
    className?: string;
    sx?: SxProps<Theme>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
const CircleComponent = React.forwardRef(function ({ color, className, sx, ...props }: CircleComponentProps, ref: any) {
    return (
        <Box
            {...props}
            ref={ref}
            className={className}
            sx={[
                {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            <Box
                sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: colors[color],
                }}
            />
        </Box>
    );
});

interface CircleProps {
    status: IDeviceStatus;
    className?: string;
    inTransition: boolean;
    sx?: SxProps<Theme>;
}
function Circle({ status, className, inTransition, sx }: CircleProps) {
    const [showDate, setShowDate] = useState(false);

    const titleText = status?.timestamp
        ? getCircleTooltipText(inTransition, status.value)
        : 'Zařízení nikdy nebylo připojeno';

    const titleDate = status?.timestamp ? format(new Date(status.timestamp), 'd. L. yyyy H:mm') : '?. ?. ????';

    const title = showDate ? titleDate : titleText;

    return (
        <Tooltip title={title} placement="bottom" arrow={true}>
            <CircleComponent
                color={getCircleColor(inTransition, status?.value || DeviceStatus.disconnected)}
                className={className}
                onClick={() => setShowDate(!showDate)}
                sx={sx}
            />
        </Tooltip>
    );
}

export default Circle;
