import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { IDevice } from "common/lib/models/interface/device";
import { IDiscovery } from "common/lib/models/interface/discovery";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import { isUrlHash } from "framework-ui/lib/utils/getters";
import { equals, filter, o, prop } from "ramda";
import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as deviceActions from "../store/actions/application/devices";
import * as discoveredActions from "../store/actions/application/discovery";
import { IState } from "../types";
import { getDevices, getDiscovery, getQueryField, getQueryID } from "../utils/getters";
import io from "../webSocket";
import DeviceSection from "./devices/DeviceSection";
import DiscoverySection from "./devices/DiscoverySection";

function isWritable(device: IDevice) {
	return device.permissions && device.permissions.write && Boolean(~device.permissions.write.length);
}

const useStyles = makeStyles((theme) => ({
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
		// @ts-ignore
		color: theme.grey,
		fontSize: 60,
		display: "block",
		height: 87,
		margin: "0 auto",
	},
	addIcon: {
		fontSize: 60,
	},
}));

interface DevicesProps {
	history: any;
	devices: IDevice[];
	discoveredDevices: IDiscovery[];
	openEditDialog: boolean;
	resetEditDeviceA: any;
	selectedDevice?: IDevice;
	deleteDeviceAction: any;
	deleteDevicesAction: any;
	updateDeviceAction: any;
	addDiscoveredDeviceAction: any;
	fetchDevicesAction: any;
	fetchDiscoveredDevicesAction: any;
}

function Devices(props: DevicesProps) {
	const classes = useStyles();
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

	const { devices, discoveredDevices } = props;

	return (
		<Fragment>
			<Card>
				<CardHeader title="Správa zařízení" />
				<CardContent>
					<DiscoverySection discoveredDevices={discoveredDevices} />
					<DeviceSection devices={devices} />
				</CardContent>
				<CardActions />
			</Card>
		</Fragment>
	);
}

const _mapStateToProps = (state: IState) => {
	const id = getQueryID(state);
	const deviceId = getQueryField("deviceId")(state);
	// @ts-ignore
	const discoveredDevices = prop("data", getDiscovery(state)) as IState["application"]["discovery"]["data"];
	console.log("discovered2", discoveredDevices);
	// @ts-ignore
	const toAddDevice = discoveredDevices.find(o(equals(deviceId), prop("deviceId")));
	const devices = filter(isWritable, getDevices(state));
	return {
		openCreateDialog: isUrlHash("#createDevice")(state),
		openEditDialog: isUrlHash("#editDevice")(state),
		openSensorsDialog: isUrlHash("#editSensors")(state),
		openPermissionsDialog: isUrlHash("#editPermissions")(state),
		openControlDialog: isUrlHash("#editControl")(state),
		devices,
		discoveredDevices: discoveredDevices,
		toAddDevice,
		selectedDevice: devices.find((dev) => dev._id === id),
	};
};

const _mapDispatchToProps = (dispatch: any) =>
	bindActionCreators(
		{
			fetchDevicesAction: deviceActions.fetch,
			fetchDiscoveredDevicesAction: discoveredActions.fetch,
			resetEditDeviceA: formsActions.removeForm("EDIT_DEVICE"),
			deleteDeviceAction: deviceActions.deleteDevice,
			deleteDevicesAction: deviceActions.deleteDevices,
			updateDeviceAction: deviceActions.update,
			addDiscoveredDeviceAction: discoveredActions.add,
		},
		dispatch
	);

export default connect(_mapStateToProps, _mapDispatchToProps)(Devices);
