import { Grid } from '@mui/material';
import React from 'react';
import FieldConnector from '../../components/FieldConnector';

export function EditDeviceFields({
    formName,
    buildings,
    rooms,
}: {
    formName: string;
    buildings: string[];
    rooms: string[];
}) {
    return (
        <>
            <Grid item xs={12}>
                <FieldConnector component="TextField" deepPath={`${formName}.info.name`} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
                <FieldConnector
                    deepPath={`${formName}.info.location.building`}
                    component="Autocomplete"
                    fullWidth
                    options={buildings.map((building) => ({ label: building, value: building }))}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <FieldConnector
                    deepPath={`${formName}.info.location.room`}
                    // onEnter={onEnter}
                    options={rooms.map((room) => ({ label: room, value: room }))}
                    component="Autocomplete"
                    fullWidth
                />
            </Grid>
        </>
    );
}
