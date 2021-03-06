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
import RgbSwitch from "./room/RgbSwitch";
import { ControlTypesFormNames } from "../../constants";
import { isUrlHash, getUserPresence } from "framework-ui/lib/utils/getters";
import { getQueryID, getQueryField, getDevicesLastUpdate } from "../../utils/getters";
import * as deviceActions from "../../store/actions/application/devices";
import Switch from "./room/Swich";
import Activator from "./room/Activator";
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

function generateBoxes(device: Device, classes: any) {
	return device.things.map(({ config, state }) => {
		const Comp = compMapper[config.componentType];
		if (Comp) {
			const data = state?.value;
			return (
				<Comp
					key={`${device._id}/${config.name}`}
					config={config}
					// description={description}
					// onClick={(val) => updateDeviceStateA(device.id, JSONkey, val, ControlTypesFormNames[type])}
					data={data}
					className={classes.item}
					deviceStatus={device?.state?.status}
					id={device._id}
				/>
			);
		} else errorLog("Invalid component type:", config.componentType, "of device:", device.info.title);
		return null;
	});
}

interface RoomProps {
	devices: Device[];
	location: Device["info"]["location"];
}
function Room({ devices }: RoomProps) {
	const classes = useStyles();

	const location = devices[0].info.location;
	const boxes: (JSX.Element | null)[] = devices.map((device: Device) => generateBoxes(device, classes)).flat();

	return (
		<div>
			<LocationTypography location={location} />
			<Grid container justify="center">
				{boxes}
			</Grid>
		</div>
	);
}

export default Room;
