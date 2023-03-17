import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import clsx from 'clsx';
import { logger } from 'common/src/logger';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Draggable, DraggableProvider } from '../components/Draggable';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAppBarContext } from '../hooks/useAppBarContext';
import { useEditMode } from '../hooks/useEditMode';
import { Buildings, buildingsCachedSelector } from '../selectors/devicesSelector';
import { useDevicesQuery, useUpdateDeviceMutation } from '../endpoints/devices';
import { locationPreferencesReducerActions } from '../store/slices/preferences/locationSlice';
import { byPreferences } from '../utils/sort';
import { BuildingWidget } from './locations/BuildingWidget';
import { EditModeDialog } from './locations/EditModeDialog';
import Locations from './Locations';
import { getAllDevices, getDevice } from '../selectors/getters';
import { TextField, Typography } from '@mui/material';
import { DeviceWidget } from './room/widgets/DeviceWidget';
import { Box } from '@mui/system';
import { Device } from '../store/slices/application/devicesSlice';
import { useDiscoveredDevicesQuery } from '../endpoints/discovery';
import { DiscoveredWidget } from './room/widgets/DiscoveredWidget';
import DiscoverySection from './deviceManagement/DiscoverySection';
import { DeviceDialogForm } from './deviceManagement/DeviceDialogForm';
import { not } from '../utils/ramda';
import { Link } from 'react-router-dom';

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
    const [urlSearchParams] = useSearchParams();
    const selectedDevice = useAppSelector(getDevice(urlSearchParams.get('deviceId') || ''));
    const navigate = useNavigate();
    const [updateDevice] = useUpdateDeviceMutation();
    const devices = useAppSelector(getAllDevices);

    function closeDialog() {
        navigate({ search: '' }, { replace: true });
    }

    return (
        <>
            <DiscoverySection />
            <Grid container justifyContent="center" sx={{ padding: 2 }}>
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
                            [theme.breakpoints.up('md')]: {
                                gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
                            },
                        })}
                    >
                        {searchText
                            ? devices
                                  .filter(searchByText(searchText))
                                  .map((device) => <DeviceWidget id={device._id} key={device._id} />)
                            : null}
                    </Box>
                </Grid>
            </Grid>
            {searchText ? null : <Locations title={title} pathPrefix="/management" />}
            <DeviceDialogForm
                title={selectedDevice?.info.name}
                open={Boolean(selectedDevice)}
                onClose={closeDialog}
                deviceToEdit={selectedDevice}
                onSave={async (data) => {
                    if (!selectedDevice) return;

                    const result = await updateDevice({ deviceID: selectedDevice._id, data });
                    if (not('error' in result)) closeDialog();
                }}
            />
        </>
    );
}
