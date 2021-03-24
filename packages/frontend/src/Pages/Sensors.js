import React, { Fragment, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import SensorBox from "./sensors/SensorBox";
import { connect } from "react-redux";
import { filter, isEmpty, not, o } from "ramda";
import { bindActionCreators } from "redux";

import { getQueryID, getQuerySimple } from "../utils/getters";
import FullScreenDialog from "framework-ui/lib/Components/FullScreenDialog";
import { getUserPresence, isUrlHash } from "framework-ui/lib/utils/getters";
import { getDevices } from "../utils/getters";
import * as deviceActions from "../store/actions/application/devices";
import io from "../webSocket";
import { Typography } from "@material-ui/core";
import EditNotifyForm from "../components/EditNotifyForm";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import * as sensorsActions from "../store/actions/application/devices/sensors";
import SimpleView from "./sensors/SimpleView";

const isNotEmpty = o(not, isEmpty);
function readableWithSensors(device) {
	return (
		(device.publicRead || (device.permissions && device.permissions.read)) &&
		device.sensors &&
		device.sensors.recipe
	);
}

const styles = (theme) => ({
	noDevices: {
		padding: 10,
	},
});

function updateDevice(updateDeviceAction) {
	return ({ data, deviceID, updatedAt }) => {
		updateDeviceAction({
			id: deviceID,
			sensors: {
				current: {
					data,
					updatedAt,
				},
			},
		});
	};
}

function Sensors({
	fetchDevicesAction,
	updateDeviceAction,
	devices,
	classes,
	openNotifyDialog,
	selectedDevice,
	resetEditNotifySensorsA,
	history,
	isUserPresent,
	updateNotifySensorsAction,
	prefillNotifySensorsAction,
	simpleDevice,
}) {
	useEffect(() => {
		fetchDevicesAction();
		const listener = updateDevice(updateDeviceAction);
		io.getSocket().on("sensors", listener);

		// window.addEventListener("focus", updateSensorsAction);

		return () => {
			io.getSocket().off("control", listener);
			// window.removeEventListener("focus", updateSensorsAction);
		};
	}, []);

	return (
		<Fragment>
			{isNotEmpty(devices) ? (
				devices.map((data) => <SensorBox device={data} key={data.id} enableNotify={isUserPresent} />)
			) : (
				<Typography className={classes.noDevices}>Nebyla nalezena žádná zařízení s naměřenými daty</Typography>
			)}

			<FullScreenDialog
				open={openNotifyDialog && !!selectedDevice}
				onClose={() => history.push({ hash: "", search: "" })}
				onExited={resetEditNotifySensorsA}
				heading="Editace notifikací"
			>
				<EditNotifyForm
					device={selectedDevice}
					formName="EDIT_NOTIFY_SENSORS"
					onUpdate={updateNotifySensorsAction}
					onPrefill={prefillNotifySensorsAction}
				/>
			</FullScreenDialog>

			<FullScreenDialog
				open={Boolean(simpleDevice)}
				onClose={() => history.push({ hash: "", search: "" })}
				heading={`${simpleDevice && simpleDevice.info.title}`}
			>
				<SimpleView device={simpleDevice} />
			</FullScreenDialog>
		</Fragment>
	);
}

const _mapStateToProps = (state) => {
	const devices = filter(readableWithSensors, getDevices(state));
	const id = getQueryID(state);
	const simpleId = getQuerySimple(state);
	return {
		devices,
		openNotifyDialog: isUrlHash("#editNotify")(state),
		selectedDevice: devices.find((dev) => dev.id === id),
		simpleDevice: devices.find((dev) => dev.id === simpleId),
		isUserPresent: getUserPresence(state),
	};
};

const _mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			fetchDevicesAction: deviceActions.fetch,
			updateDeviceAction: deviceActions.update,
			resetEditNotifySensorsA: formsActions.removeForm("EDIT_NOTIFY_SENSORS"),
			updateNotifySensorsAction: sensorsActions.updateNotifySensors,
			prefillNotifySensorsAction: sensorsActions.prefillNotify,
		},
		dispatch
	);

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(Sensors));
