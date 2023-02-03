import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import clsx from 'clsx';
import { logger } from 'common/src/logger';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Draggable, DraggableProvider } from '../components/Draggable';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAppBarContext } from '../hooks/useAppBarContext';
import { useEditMode } from '../hooks/useEditMode';
import { Buildings, buildingsCachedSelector } from '../selectors/devicesSelector';
import { useDevicesQuery } from '../endpoints/devices';
import { locationPreferencesReducerActions } from '../store/slices/preferences/locationSlice';
import { byPreferences } from '../utils/sort';
import { BuildingWidget } from './locations/BuildingWidget';
import { EditModeDialog } from './locations/EditModeDialog';
import Locations from './Locations';
import { getAllDevices } from '../selectors/getters';
import { TextField, Typography } from '@mui/material';
import { DeviceWidget } from './room/widgets/DeviceWidget';
import { Box } from '@mui/system';
import { Device } from '../store/slices/application/devicesSlice';

function searchByText(text: string) {
    const search = text.toLowerCase();
    return (device: Device) =>
        device.info.name.toLowerCase().includes(search) ||
        device.metadata.deviceId.toLowerCase().includes(search) ||
        device.info.location.building.toLowerCase().includes(search) ||
        device.info.location.room.toLowerCase().includes(search);
}

interface DevicesProps {
    title?: string;
}
export default function LocationsManagement({ title }: DevicesProps) {
    const [searchText, setSearchText] = useState('');

    const devices = useAppSelector(getAllDevices);

    return (
        <>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={7} lg={6} xl={5}>
                    <TextField
                        variant="standard"
                        label="Vyhledávání"
                        fullWidth
                        sx={{ marginTop: 1 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Box
                        sx={(theme) => ({
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(8rem, 1fr))',
                            gap: 2,
                            padding: 2,
                            [theme.breakpoints.up('md')]: {
                                gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
                            },
                        })}
                    >
                        {searchText
                            ? devices.filter(searchByText(searchText)).map((device) => <DeviceWidget id={device._id} />)
                            : null}
                    </Box>
                </Grid>
            </Grid>
            {searchText ? null : <Locations title={title} />}
        </>
    );
}
