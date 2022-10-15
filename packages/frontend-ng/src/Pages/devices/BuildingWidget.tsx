import { Box, Grid, SxProps, Theme } from '@mui/material';
import React from 'react';
import { Draggable } from '../../components/Draggable';
import { useAppSelector } from '../../hooks';
import { byPreferences } from '../../utils/sort';
import { LocationTypography } from './LocationTypography';
import RoomWidget from './RoomWidget';

const roomsContainerStyle: SxProps<Theme> = (theme) => ({
    display: 'grid',
    // gridTemplateColumns: 'repeat(1, 1fr)',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: 1,
    paddingLeft: 1,
    paddingRight: 1,
    [theme.breakpoints.up('xl')]: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(30rem, 1fr))',
        // gap: 4,
    },
    [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(23rem, 1fr))',
        // gap: 3,
        // paddingLeft: 5,
        // paddingRight: 5,
    },
    [theme.breakpoints.up('xs')]: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
        gap: 2,
        paddingLeft: 2,
        paddingRight: 2,
    },
});

interface BuildingWidgetProps {
    isDragable?: boolean;
    building: {
        id: string;
        name: string;
        rooms: {
            name: string;
            id: string;
            deviceIDs: string[];
        }[];
    };
    editMode: 'rooms' | 'buildings' | false;
    isSingle: boolean;
    onMove: (dragId: string, hoverId: string) => any;
}
export const BuildingWidget = React.forwardRef<HTMLDivElement, BuildingWidgetProps>(
    ({ isDragable, building, editMode, isSingle, onMove }, ref) => {
        const locationPreferences = useAppSelector((state) => state.preferences.locations.entities);

        return (
            <Grid item xs={12} md={10} lg={8} xl={7} sx={{ opacity: isDragable ? 0.4 : 1, paddingBottom: 2 }} ref={ref}>
                <LocationTypography location={{ building: building.name }} showRootSlash={isSingle} />
                <Box sx={roomsContainerStyle}>
                    {building.rooms.sort(byPreferences(locationPreferences)).map((room, idx) => {
                        if (editMode === 'rooms')
                            return (
                                <Draggable
                                    id={room.id}
                                    key={room.id}
                                    index={idx}
                                    render={(isDragable: boolean, ref) => (
                                        <RoomWidget
                                            ref={ref}
                                            deviceIDs={room.deviceIDs}
                                            link={room.id}
                                            sx={{ opacity: isDragable ? 0.4 : 1 }}
                                        />
                                    )}
                                    onMove={onMove}
                                    type={building.name}
                                />
                            );
                        return <RoomWidget key={room.id} deviceIDs={room.deviceIDs} link={room.id} />;
                    })}
                </Box>
            </Grid>
        );
    }
);
