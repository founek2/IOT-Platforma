import { Grid } from "@material-ui/core";
import FieldConnector from "framework-ui/lib/Components/FieldConnector";
import { getFieldVal } from "framework-ui/lib/utils/getters";
import React from "react";
import { useAppSelector } from "../hooks";
import { Locations } from "../types";

interface DeviceFormProps {
    formName: 'CREATE_DEVICE' | 'EDIT_DEVICE';
    onEnter?: () => void;
    locations: Locations;
}
export function DeviceForm({ formName, onEnter, locations }: DeviceFormProps) {
    const selectedBuilding = useAppSelector(getFieldVal(`${formName}.info.location.building`)) as string


    return (
        <>
            <Grid item xs={12}>
                <FieldConnector deepPath={`${formName}.info.name`} fieldProps={{ fullWidth: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <FieldConnector
                    deepPath={`${formName}.info.location.building`}
                    component="Autocomplete"
                    fieldProps={{ fullWidth: true }}
                    selectOptions={[...locations.keys()]}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <FieldConnector
                    deepPath={`${formName}.info.location.room`}
                    onEnter={onEnter}
                    fieldProps={{ fullWidth: true }}
                    selectOptions={[...((selectedBuilding && locations.get(selectedBuilding)) || [])]}
                    component="Autocomplete"
                />
            </Grid>
        </>
    );
}
