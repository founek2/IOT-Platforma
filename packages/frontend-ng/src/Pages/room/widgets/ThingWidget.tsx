import type { SxProps, Theme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import React from 'react';
import { useAppSelector } from '../../../hooks/index';
import { getThing } from '../../../selectors/getters';
import { Link } from 'react-router-dom';
import { ThingContext } from '../../../hooks/useThing';
import { ComponentType, PropertyDataType } from 'common/src/models/interface/thing';
import { Thing } from '../../../store/slices/application/thingsSlice';
import { PropertyRowPlain } from '../PropertyRow';
import { Box } from '@mui/material';
import { useUpdateThingStateMutation } from '../../../endpoints/thing';

function getApropriateProperty(config: Thing['config']) {
    if (config.componentType === ComponentType.activator) {
        return config.properties.find((prop) => prop.dataType === PropertyDataType.enum);
    }
    if (config.componentType === ComponentType.switch) {
        return config.properties.find((prop) => prop.dataType === PropertyDataType.boolean);
    }
    if (config.componentType === ComponentType.sensor) {
        return config.properties.find(
            (prop) => prop.dataType === PropertyDataType.float || prop.dataType === PropertyDataType.integer
        );
    }
}

interface ThingWidgetProps {
    id: string;
    sx?: SxProps<Theme>;
    className?: string;
}
export const ThingWidget = React.forwardRef<HTMLDivElement, ThingWidgetProps>(({ id, sx, className }, ref) => {
    const thing = useAppSelector(getThing(id));
    if (!thing) return null;
    const appropriateThing = getApropriateProperty(thing.config);
    const [updatePropertyState] = useUpdateThingStateMutation();

    return (
        <ThingContext.Provider value={thing}>
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
                <Link to={{ search: `thingId=${thing._id}` }}>
                    <Typography
                        sx={{
                            overflow: 'hidden',
                            textAlign: 'center',
                            paddingTop: 1,
                            paddingBottom: 1,
                        }}
                    >
                        {thing.config.name}
                    </Typography>
                </Link>
                {appropriateThing ? (
                    <Box sx={{ display: 'flex', justifyContent: 'inherit' }}>
                        <PropertyRowPlain
                            value={thing.state?.value[appropriateThing.propertyId]}
                            property={appropriateThing}
                            onChange={(value) =>
                                updatePropertyState({
                                    deviceId: thing.deviceId,
                                    propertyId: appropriateThing.propertyId,
                                    thingId: thing._id,
                                    nodeId: thing.config.nodeId,
                                    value,
                                })
                            }
                        />
                    </Box>
                ) : null}
            </Paper>
        </ThingContext.Provider>
    );
});
