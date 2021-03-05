import React, { useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { filter, isEmpty } from "ramda";
import { bindActionCreators } from "redux";
import { makeStyles, Typography } from "@material-ui/core";
import FullScreenDialog from "framework-ui/lib/Components/FullScreenDialog";
import isBefore from "date-fns/isBefore";
import subSeconds from "date-fns/subSeconds";

import io from "../webSocket";
import { isUrlHash, getUserPresence } from "framework-ui/lib/utils/getters";
import { getQueryID, getQueryField, getDevicesLastUpdate } from "../utils/getters";
import * as deviceActions from "../store/actions/application/devices";

import { getDevices } from "../utils/getters";
import { errorLog } from "framework-ui/lib/logger";
import EditNotifyForm from "../components/EditNotifyForm";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import * as controlActions from "../store/actions/application/devices/control";
import { ComponentType, IThing } from "common/lib/models/interface/thing";
import { Device } from "common/lib/models/interface/device";
import RoomWidget from "./deviceControl/RoomWidget";

function isControllable(device: Device) {
	return Boolean(device.permissions && device.permissions.control);
}

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	item: {
		width: 150,
		[theme.breakpoints.down("sm")]: {
			width: `calc(50% - ${theme.spacing(1.5)}px)`, // to add spacing to right
			margin: `${theme.spacing(1)}px 0 0 ${theme.spacing(1)}px`,
		},
	},
}));

function updateDevice(updateDeviceAction: any) {
	return ({ data, deviceID, updatedAt }: any) => {
		console.log("web socket GOT");
		const updateObj: any = {
			id: deviceID,
			ack: updatedAt,
		};
		if (data) updateObj.control = { current: { data } };

		updateDeviceAction(updateObj);
	};
}

interface DeviceControlProps {
	devices: Device[];
	fetchDevicesAction: any;
	// updateDeviceStateA,
	updateDeviceAction: any;
	fetchControlAction: any;
	devicesLastUpdate: any;
	rooms: Map<string, Device[]>;
}
function DeviceControl({
	devices,
	fetchDevicesAction,
	// updateDeviceStateA,
	updateDeviceAction,
	fetchControlAction,
	// openNotifyDialog,
	// selectedDevice,
	// history,
	// resetEditNotifyControlA,
	// updateNotifyControlA,
	// prefillNotifyControlA,
	// JSONkey,
	devicesLastUpdate,
	rooms,
}: DeviceControlProps) {
	const classes = useStyles();
	useEffect(() => {
		fetchDevicesAction();

		const listener = updateDevice(updateDeviceAction);
		io.getSocket().on("control", listener);

		const listenerAck = updateDevice(updateDeviceAction);
		io.getSocket().on("ack", listenerAck);

		return () => {
			io.getSocket().off("control", listener);
			io.getSocket().off("ack", listenerAck);
		};
	}, [fetchDevicesAction, updateDeviceAction]);

	useEffect(() => {
		const handler = () => {
			if (isBefore(new Date(devicesLastUpdate), subSeconds(new Date(), 30))) fetchControlAction();
		};
		const listenConnect = () => {
			console.log("connect");
			window.removeEventListener("focus", handler);
		};
		const listenDisconnect = () => {
			console.log("disconnected");
			window.addEventListener("focus", handler);
		};

		io.getSocket().on("disconnect", listenDisconnect);
		io.getSocket().on("connect", listenConnect);

		return () => {
			io.getSocket().off("disconnect", listenDisconnect);
			io.getSocket().off("connect", listenConnect);
		};
	}, [fetchControlAction, devicesLastUpdate]);

	// const boxes: JSX.Element[] = devices.map((device: Device) => generateBoxes(device, classes)).flat();

	return (
		<div className={classes.root}>
			{isEmpty(devices) ? (
				<Typography>Nebyla nalezena žádná zařízení</Typography>
			) : (
				[...rooms.entries()].map(([_, devices]) => <RoomWidget devices={devices} />)
			)}
			{/* <FullScreenDialog
				open={openNotifyDialog && !!selectedDevice}
				onClose={() => history.push({ hash: "", search: "" })}
				onExited={resetEditNotifyControlA}
				heading="Editace notifikací"
			>
				<EditNotifyForm
					device={selectedDevice}
					formName="EDIT_NOTIFY_CONTROL"
					onUpdate={updateNotifyControlA}
					onPrefill={(id: string) => prefillNotifyControlA(id, JSONkey)}
					JSONkey={JSONkey}
				/>
			</FullScreenDialog> */}
		</div>
	);
}

const _mapStateToProps = (state: any) => {
	const id = getQueryID(state);
	const JSONkey = getQueryField("JSONkey", state);
	const devices: Device[] = filter(isControllable, getDevices(state));

	const rooms = new Map<string, Device[]>();
	devices.forEach((device) => {
		const key = device.info.location.building + "/" + device.info.location.room;
		rooms.set(key, [...(rooms.get(key) || []), device]);
	});

	return {
		rooms,
		devices,
		openNotifyDialog: isUrlHash("#editNotify")(state),
		selectedDevice: devices.find((dev) => dev._id === id),
		isUserPresent: getUserPresence(state),
		devicesLastUpdate: getDevicesLastUpdate(state),
		JSONkey,
	};
};

const _mapDispatchToProps = (dispatch: any) =>
	bindActionCreators(
		{
			fetchDevicesAction: deviceActions.fetch,
			updateDeviceStateA: deviceActions.updateState,
			updateDeviceAction: deviceActions.update,
			fetchControlAction: deviceActions.fetchControl,
			resetEditNotifyControlA: formsActions.removeForm("EDIT_NOTIFY_SENSORS"),
			updateNotifyControlA: controlActions.updateNotify,
			prefillNotifyControlA: controlActions.prefillNotify,
		},
		dispatch
	);

export default connect(_mapStateToProps, _mapDispatchToProps)(DeviceControl);
