import React, { Fragment } from "react";
import FieldConnector from "framework-ui/lib/Components/FieldConnector";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";

import { getFieldVal } from "framework-ui/lib/utils/getters";
import { ControlStateTypes, NotifyControlTypes } from "../../../constants";
import { IState } from "frontend/src/types";
import { IThingProperty, IThing } from "common/lib/models/interface/thing";
import { NotifyType } from "common/lib/models/interface/notifyInterface";

interface PropertyPartProps {
	id: number;
	config: IThing["config"];
	selectedProperty?: IThingProperty;
}

function PropertyPart({ id, config, selectedProperty }: PropertyPartProps) {
	return (
		<Fragment>
			<Grid item md={4} xs={12}>
				<FieldConnector
					component="Select"
					deepPath={`EDIT_NOTIFY.propertyId.${id}`}
					fieldProps={{
						fullWidth: true,
					}}
					selectOptions={config.properties.map(({ name, propertyId }) => (
						<MenuItem value={propertyId} key={propertyId}>
							{name}
						</MenuItem>
					))}
				/>
			</Grid>
			{Boolean(selectedProperty) && (
				<Fragment>
					<Grid item md={4} xs={12}>
						<FieldConnector
							component="Select"
							deepPath={`EDIT_NOTIFY.type.${id}`}
							fieldProps={{
								fullWidth: true,
							}}
							// selectOptions={NotifyControlTypes[selectedJSONkey].map(({ value, label }) => (
							// 	<MenuItem value={value} key={value}>
							// 		{label}
							// 	</MenuItem>
							// ))}
							selectOptions={Object.values(NotifyType).map((value) => (
								<MenuItem value={value} key={value}>
									{value}
								</MenuItem>
							))}
						/>
					</Grid>
					<Grid item md={4} xs={12}>
						<FieldConnector
							component="Select"
							deepPath={`EDIT_NOTIFY.value.${id}`}
							fieldProps={{
								fullWidth: true,
							}}
							// selectOptions={NotifyControlTypes[selectedJSONkey].map(({ value, label }) => (
							// 	<MenuItem value={value} key={value}>
							// 		{label}
							// 	</MenuItem>
							// ))}
							selectOptions={selectedProperty?.format.map((value) => (
								<MenuItem value={value} key={value}>
									{value}
								</MenuItem>
							))}
						/>
					</Grid>
				</Fragment>
			)}
			{/* <FieldConnector
                deepPath={`EDIT_NOTIFY.value.${id}`}
            /> */}
		</Fragment>
	);
}

const _mapStateToProps = (state: IState, { id, config }: { id: number; config: IThing["config"] }) => {
	const selectedPropId = getFieldVal(`EDIT_NOTIFY.propertyId.${id}`, state) as
		| IThingProperty["propertyId"]
		| undefined;

	const selectedProperty: IThingProperty | undefined = selectedPropId
		? config.properties.find(({ propertyId }) => propertyId === selectedPropId)
		: undefined;

	return {
		selectedProperty,
	};
};

export default connect(_mapStateToProps)(PropertyPart);
