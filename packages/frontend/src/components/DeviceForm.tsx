import { Grid } from "@material-ui/core";
import FieldConnector from "framework-ui/lib/Components/FieldConnector";
import React from "react";

export function DeviceForm({ formName, onEnter }: { formName: "CREATE_DEVICE" | "EDIT_DEVICE"; onEnter?: () => void }) {
	return (
		<>
			<Grid item md={12}>
				<FieldConnector deepPath={`${formName}.info.name`} fieldProps={{ fullWidth: true }} />
			</Grid>
			<Grid item md={4}>
				<FieldConnector deepPath={`${formName}.info.location.building`} />
			</Grid>
			<Grid item md={4}>
				<FieldConnector deepPath={`${formName}.info.location.room`} onEnter={onEnter} />
			</Grid>
		</>
	);
}
