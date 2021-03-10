import React, { useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { filter, isEmpty } from "ramda";
import { bindActionCreators } from "redux";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import FullScreenDialog from "framework-ui/lib/Components/FullScreenDialog";
import isBefore from "date-fns/isBefore";
import subSeconds from "date-fns/subSeconds";

import io from "../../webSocket";
import { ControlTypesFormNames } from "../../constants";
import { isUrlHash, getUserPresence } from "framework-ui/lib/utils/getters";
import { getQueryID, getQueryField, getDevicesLastUpdate } from "../../utils/getters";
import * as deviceActions from "../../store/actions/application/devices";
import Switch from "./room/Swich";
import { getDevices } from "../../utils/getters";
import { errorLog } from "framework-ui/lib/logger";
import EditNotifyForm from "../../components/EditNotifyForm";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import * as controlActions from "../../store/actions/application/devices/control";
import MusicCast from "./room/MusicCast";
import Sensor from "./room/Sensor";
import { ComponentType, IThing } from "common/lib/models/interface/thing";
import { Device } from "common/lib/models/interface/device";
import { LocationTypography } from "frontend/src/components/LocationTypography";

const compMapper = {
	[ComponentType.Switch]: Switch,
	[ComponentType.BinarySensor]: null,
	[ComponentType.Sensor]: Sensor,
};

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

function generateBoxes(device: Device, updateState: any, classes: any) {
	return device.things.map((thing) => {
		const { _id, config, state } = thing;
		const Comp = compMapper[config.componentType];
		if (Comp) {
			const data = state?.value;
			return (
				<Comp
					key={_id}
					thing={thing}
					// description={description}
					onClick={(state: any) => updateState(device._id, _id, state)}
					lastChange={state?.timeStamp}
					className={classes.item}
					deviceStatus={device?.state?.status}
					deviceId={device._id}
					room={device.info.location.room}
				/>
			);
		} else errorLog("Invalid component type:", config.componentType, "of device:", device.info.name);
		return null;
	});
}

interface RoomProps {
	devices: Device[];
	location: Device["info"]["location"];
	updateDeviceStateA: any;
}
function Room({ devices, updateDeviceStateA }: RoomProps) {
	const classes = useStyles();

	const location = devices[0].info.location;
	const boxes: (JSX.Element | null)[] = devices
		.map((device: Device) => generateBoxes(device, updateDeviceStateA, classes))
		.flat();

	return (
		<div>
			<LocationTypography location={location} />
			<Grid container justify="center">
				{boxes}
			</Grid>
		</div>
	);
}
const _mapDispatchToProps = (dispatch: any) =>
	bindActionCreators(
		{
			updateDeviceStateA: deviceActions.updateState,
		},
		dispatch
	);

export default connect(undefined, _mapDispatchToProps)(Room);
