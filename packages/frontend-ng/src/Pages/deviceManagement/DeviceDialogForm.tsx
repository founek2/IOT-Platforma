import { Button, Dialog, DialogActions, DialogContent, Grid } from '@mui/material';
import { getFieldVal } from 'common/src/utils/getters';
import React, { useEffect, useState } from 'react';
import FieldConnector from '../../components/FieldConnector';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useForm } from '../../hooks/useForm';
import { locationsSelector } from '../../selectors/locationsSelector';
import PermissionSelect from './PermissionSelect';
import { Device } from '../../store/slices/application/devicesSlice';
import { useUserNamesQuery } from '../../endpoints/users';
import { EditDeviceFormData } from '../../endpoints/devices';

const formName = 'EDIT_DEVICE';
interface DeviceFormProps {
    open: boolean;
    onClose: () => any;
    onSave: (data: EditDeviceFormData) => Promise<any>;
    title?: string;
    deviceToEdit?: Device;
}
export function DeviceDialogForm({ open, onClose, title, onSave, deviceToEdit }: DeviceFormProps) {
    const [pending, setPending] = useState(false);
    const { setFieldValue, validateForm, setFormData, resetForm } = useForm<EditDeviceFormData>(formName);
    const { data: userNames } = useUserNamesQuery(undefined, { pollingInterval: 60 * 1000 });
    const buildings = useAppSelector(locationsSelector);
    const selectedBuildingName = useAppSelector(getFieldVal(`${formName}.info.location.building`)) as string;
    const selectedRoomName = useAppSelector(getFieldVal(`${formName}.info.location.room`)) as string;

    const selectedBuilding = buildings.find((building) => building.name === selectedBuildingName);
    const availableRooms = selectedBuilding ? selectedBuilding.rooms.map((room) => room.name) : [];

    useEffect(() => {
        if (!availableRooms.some((v) => v === selectedRoomName)) setFieldValue('', ['info', 'location', 'room']);
    }, [selectedBuildingName]);

    useEffect(() => {
        if (deviceToEdit)
            setFormData({
                info: {
                    name: deviceToEdit.info.name,
                    location: {
                        room: deviceToEdit.info.location.room,
                        building: deviceToEdit.info.location.building,
                    },
                },
                permissions: deviceToEdit.permissions,
            });

        return () => resetForm();
    }, [deviceToEdit, setFormData, resetForm]);

    async function handleSave() {
        const { valid, data } = validateForm();
        if (valid) {
            setPending(true);
            await onSave(data);
            setPending(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} title={title}>
            <DialogContent>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <FieldConnector component="TextField" deepPath={`${formName}.info.name`} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FieldConnector
                            deepPath={`${formName}.info.location.building`}
                            component="Autocomplete"
                            fullWidth
                            options={buildings.map((building) => ({ label: building.name, value: building.name }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FieldConnector
                            deepPath={`${formName}.info.location.room`}
                            // onEnter={onEnter}
                            options={availableRooms.map((room) => ({ label: room, value: room }))}
                            component="Autocomplete"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FieldConnector
                            deepPath={`${formName}.permissions`}
                            // onEnter={onEnter}
                            component={({ label, error, value, onChange }) => (
                                <PermissionSelect
                                    sx={{ maxHeight: 300 }}
                                    label={label}
                                    error={error}
                                    permissions={value}
                                    onChange={onChange}
                                    userNames={userNames || []}
                                />
                            )}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} disabled={pending}>
                    Uložit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
