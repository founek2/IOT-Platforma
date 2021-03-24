import { Fab, Grid, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "framework-ui/lib/Components/Dialog";
import FieldConnector from "framework-ui/lib/Components/FieldConnector";
import EnchancedTable from "framework-ui/lib/Components/Table";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import { isUrlHash } from "framework-ui/lib/utils/getters";
import { assoc, prop, map } from "ramda";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import type { DeviceStatus, IDevice, IDeviceStatus } from "common/lib/models/interface/device";
import { IDiscovery, IDiscoveryThing } from "common/lib/models/interface/discovery";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { DeviceForm } from "frontend/src/components/DeviceForm";
import * as userNameActions from "../../store/actions/application/userNames";
import { getUserNames } from "../../utils/getters";
import { IState } from "../../types";

interface DiscoverySectionProps {
	devices?: IDevice[];
	resetEditDeviceAction: any;
	deleteDiscoveryAction: any;
	updateFormField: any;
	fetchUserNames: any;
	userNames: IState["application"]["userNames"];
}

function EditDeviceForm({ userNames, fetchUserNames }: DiscoverySectionProps) {
	useEffect(() => {
		fetchUserNames();
	}, []);

	return (
		<>
			<DeviceForm formName="EDIT_DEVICE" />

			{userNames.data.length && (
				<>
					{" "}
					<Grid item md={6}>
						<FieldConnector
							deepPath="EDIT_DEVICE.permissions.read"
							component="ChipArray"
							optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
							// className={classes.chipArray}
						/>
					</Grid>
					<Grid item md={6}>
						<FieldConnector
							deepPath="EDIT_DEVICE.permissions.write"
							component="ChipArray"
							optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
							// className={classes.chipArray}
						/>
					</Grid>{" "}
					<Grid item md={6}>
						<FieldConnector
							deepPath="EDIT_DEVICE.permissions.control"
							component="ChipArray"
							optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
							// className={classes.chipArray}
						/>
					</Grid>
				</>
			)}
		</>
	);
}

const _mapStateToProps = (state: any) => {
	return {
		userNames: getUserNames(state),
	};
};

const _mapDispatchToProps = (dispatch: any) =>
	bindActionCreators(
		{
			resetEditDeviceAction: formsActions.removeForm("EDIT_DEVICE"),
			fetchUserNames: userNameActions.fetch,
		},
		dispatch
	);

export default connect(_mapStateToProps, _mapDispatchToProps)(EditDeviceForm as any);
