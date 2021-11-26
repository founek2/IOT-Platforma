import { Grid } from "@material-ui/core";
import FieldConnector from "framework-ui/lib/Components/FieldConnector";
import React from "react";
import { Locations } from "../types";
import TextField from '@material-ui/core/TextField';
import { useSelector } from "react-redux";
import { getFieldVal } from "framework-ui/lib/utils/getters";
import { RootState } from "../store/store";

interface DeviceFormProps {
    formName: "CREATE_DEVICE" | "EDIT_DEVICE"
    onEnter?: () => void
    locations: Locations
}
export function DeviceForm({ formName, onEnter, locations }: DeviceFormProps) {
    const selectedBuilding = useSelector<RootState, string | undefined>(getFieldVal(`${formName}.info.location.building`))
    console.log("building", selectedBuilding)
    return (
        <>
            <Grid item xs={12}>
                <FieldConnector deepPath={`${formName}.info.name`} fieldProps={{ fullWidth: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>


                <FieldConnector deepPath={`${formName}.info.location.building`} component="Autocomplete" fieldProps={{ fullWidth: true }}
                    selectOptions={[...locations.keys()]}

                // component={props => <Autocomplete
                //     options={[...locations.keys()]}
                //     {...props}
                //     onChange={(e, value) => {
                //         props.onChange({ target: { value: value } })
                //     }}

                //     renderInput={(params) => {

                //         return <TextField label={props.label} {...params} />
                //     }}
                // />} 
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>

                <FieldConnector deepPath={`${formName}.info.location.room`} onEnter={onEnter} fieldProps={{ fullWidth: true }} selectOptions={[...(selectedBuilding && locations.get(selectedBuilding) || [])]}
                    component="Autocomplete"
                // component={props => <Autocomplete
                //     options={[...(selectedBuilding && locations.get(selectedBuilding) || [])]}
                //     {...props}
                //     onChange={(e, value) => {
                //         props.onChange({ target: { value: value } })
                //     }}
                //     renderInput={(params) => {
                //         return <TextField {...params} {...props} />
                //     }}
                // />}
                />
            </Grid>
        </>
    );
}
