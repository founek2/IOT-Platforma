import React, { Fragment, Component, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import ControlBox from "./devices/ControlBox";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import AddCircle from "@material-ui/icons/AddCircle";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { assoc, equals, filter, o, prop } from "ramda";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import AddIcon from "@material-ui/icons/Add";

import { isUrlHash } from "framework-ui/lib/utils/getters";
import FieldConnector from "framework-ui/lib/Components/FieldConnector";
import CreateDeviceForm from "./devices/CreateDeviceForm";
import EditDeviceForm from "./devices/EditDeviceForm";
import EditSensorsForm from "./devices/EditSensorsForm";
import FullScreenDialog from "framework-ui/lib/Components/FullScreenDialog";
import { getDevices, getDiscovery, getQueryField } from "../utils/getters";
import * as deviceActions from "../store/actions/application/devices";
import * as discoveredActions from "../store/actions/application/discovery";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import { getQueryID } from "../utils/getters";
import EditPermissions from "./devices/EditPermissions";
import EditControlForm from "./devices/EditControlForm";
import EnchancedTable from "framework-ui/lib/Components/Table";
import { Fab, Grid } from "@material-ui/core";
import Dialog from "framework-ui/lib/Components/Dialog";
import DiscoverySection from "./devices/DiscoverySection";
import OnlineCircle from "../components/OnlineCircle";
import io from "../webSocket";

function isWritable(device) {
	return device.permissions && device.permissions.write;
}

const styles = (theme) => ({
	cardPlus: {
		width: "25%",
		height: 200,
		display: "flex",
		float: "left",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
		},
	},
	wraper: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		width: "100%",
	},
	addButton: {
		color: theme.grey,
		fontSize: 60,
		display: "block",
		height: 87,
		margin: "0 auto",
	},
	addIcon: {
		fontSize: 60,
	},
});

function Devices(props) {
	useEffect(() => {
		props.fetchDevicesAction();
		props.fetchDiscoveredDevicesAction();

		io.getSocket().on("device", props.updateDeviceAction);
		io.getSocket().on("deviceDiscovered", props.addDiscoveredDeviceAction);

		return () => {
			io.getSocket().off("device", props.updateDeviceAction);
			io.getSocket().off("deviceDiscovered", props.addDiscoveredDeviceAction);
		};
	}, [props.updateDeviceAction, props.addDiscoveredDeviceAction]);

	const {
		classes,
		openCreateDialog,
		history,
		devices,
		discoveredDevices,
		openEditDialog,
		resetEditDeviceA,
		resetEditSensorsA,
		resetEditControlA,
		resetEditPermissionsA,
		openSensorsDialog,
		selectedDevice,
		deleteDeviceAction,
		openPermissionsDialog,
		openControlDialog,
		deleteDiscoveryAction,
		deleteDevicesAction,
	} = props;

	return (
		<Fragment>
			<Card className={classes.card}>
				<CardHeader title="Správa zařízení" />
				<CardContent>
					<DiscoverySection discoveredDevices={discoveredDevices} />
					<FieldConnector
						deepPath="DEVICE_MANAGEMENT.selected"
						component={({ onChange, value }) => (
							<EnchancedTable
								dataProps={[
									{ path: "info.name", label: "Název" },
									{
										path: "info.location",
										label: "Umístění",
										convertor: ({ building, room }) => `${building}/${room}`,
									},
									{ path: "things", label: "Věcí", convertor: (things) => things.length },
									{
										path: "createdAt",
										label: "Vytvořeno",
										convertor: (date) => new Date(date).toLocaleDateString(),
									},
									{
										path: "state.status",
										label: "Status",
										convertor: (status) => <OnlineCircle status={status} inTransition={false} />,
									},
								]}
								data={devices.map((device) => assoc("id", prop("_id", device), device))}
								toolbarHead="Seznam"
								onDelete={deleteDevicesAction}
								orderBy="userName"
								// enableCreation={isAdmin}
								//onAdd={() => this.updateCreateForm({ open: true })}
								//enableEdit={isAdmin}
								//onEdit={(id) => history.push({ hash: "editUser", search: "?id=" + id })}
								rowsPerPage={10}
								onChange={onChange}
								value={value}
							/>
						)}
					/>
				</CardContent>
				<CardActions />
			</Card>

			<Fragment>
				<FullScreenDialog
					open={openCreateDialog}
					onClose={() => history.push({ hash: "" })}
					heading="Tvorba zařízení"
				>
					<CreateDeviceForm />
				</FullScreenDialog>
				<FullScreenDialog
					open={openEditDialog && !!selectedDevice}
					onClose={() => history.push({ hash: "", search: "" })}
					onExited={resetEditDeviceA}
					heading="Editace zařízení"
				>
					<EditDeviceForm device={selectedDevice} />
				</FullScreenDialog>
				<FullScreenDialog
					open={openSensorsDialog && !!selectedDevice}
					onClose={() => history.push({ hash: "", search: "" })}
					onExited={resetEditSensorsA}
					heading="Editace senzorů"
				>
					<EditSensorsForm device={selectedDevice} />
				</FullScreenDialog>
				<FullScreenDialog
					open={openControlDialog && !!selectedDevice}
					onClose={() => history.push({ hash: "", search: "" })}
					onExited={resetEditControlA}
					heading="Editace ovládání"
				>
					<EditControlForm device={selectedDevice} />
				</FullScreenDialog>
				<FullScreenDialog
					open={openPermissionsDialog && !!selectedDevice}
					onClose={() => history.push({ hash: "", search: "" })}
					onExited={resetEditPermissionsA}
					heading="Editace oprávnění"
				>
					<EditPermissions device={selectedDevice} />
				</FullScreenDialog>
			</Fragment>
		</Fragment>
	);
}

const _mapStateToProps = (state) => {
	const id = getQueryID(state);
	const deviceId = getQueryField("deviceId")(state);
	const discoveredDevices = prop("data", getDiscovery(state));
	const toAddDevice = discoveredDevices.find(o(equals(deviceId), prop("deviceId")));
	const devices = filter(isWritable, getDevices(state));
	return {
		openCreateDialog: isUrlHash("#createDevice")(state),
		openEditDialog: isUrlHash("#editDevice")(state),
		openSensorsDialog: isUrlHash("#editSensors")(state),
		openPermissionsDialog: isUrlHash("#editPermissions")(state),
		openControlDialog: isUrlHash("#editControl")(state),
		devices,
		discoveredDevices,
		toAddDevice,
		selectedDevice: devices.find((dev) => dev.id === id),
	};
};

const _mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			fetchDevicesAction: deviceActions.fetch,
			fetchDiscoveredDevicesAction: discoveredActions.fetch,
			resetEditDeviceA: formsActions.removeForm("EDIT_DEVICE"),
			resetEditSensorsA: formsActions.removeForm("EDIT_SENSORS"),
			resetEditPermissionsA: formsActions.removeForm("EDIT_PERMISSIONS"),
			resetEditControlA: formsActions.removeForm("EDIT_CONTROL"),
			deleteDeviceAction: deviceActions.deleteDevice,
			deleteDiscoveryAction: discoveredActions.deleteDevices,
			resetAddDeviceAction: formsActions.removeForm("CREATE_DEVICE"),
			deleteDevicesAction: deviceActions.deleteDevices,
			updateDeviceAction: deviceActions.update,
			addDiscoveredDeviceAction: discoveredActions.add,
		},
		dispatch
	);

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(Devices));
