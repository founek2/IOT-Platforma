import { Grid } from '@mui/material';
import { getFieldVal } from 'common/src/utils/getters';
import React, { useEffect } from 'react';
import FieldConnector from '../../components/FieldConnector';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { locationsSelector } from '../../selectors/locationsSelector';
import { useUserNamesQuery } from '../../services/users';
import { formsDataActions } from '../../store/slices/formDataActions';
import PermissionSelect from './PermissionSelect';

interface DeviceFormProps {
    formName: 'EDIT_DEVICE';
}
export function DeviceForm({ formName }: DeviceFormProps) {
    const { data: userNames } = useUserNamesQuery(undefined, { pollingInterval: 60 * 1000 });
    const buildings = useAppSelector(locationsSelector);
    const selectedBuildingName = useAppSelector(getFieldVal(`${formName}.info.location.building`)) as string;
    const selectedRoomName = useAppSelector(getFieldVal(`${formName}.info.location.room`)) as string;
    const dispatch = useAppDispatch();

    const selectedBuilding = buildings.find((building) => building.name === selectedBuildingName);
    const availableRooms = selectedBuilding ? selectedBuilding.rooms.map((room) => room.name) : [];

    useEffect(() => {
        if (!availableRooms.some((v) => v === selectedRoomName))
            dispatch(formsDataActions.setFormField({ deepPath: `${formName}.info.location.room`, value: '' }));
    }, [selectedBuildingName]);

    return (
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
    );
}
