import React, { useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { filter, isEmpty } from "ramda";
import { bindActionCreators } from "redux";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import FullScreenDialog from "framework-ui/lib/Components/FullScreenDialog";
import isBefore from "date-fns/isBefore";
import subSeconds from "date-fns/subSeconds";

import io from "../../webSocket";
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
import { ComponentType, IThing } from "common/lib/models/interface/thing";
import { Device } from "common/lib/models/interface/device";

const useStyles = makeStyles((theme) => ({
	widget: {
		display: "flex",
		padding: theme.spacing(4),
		borderRadius: "1em",
	},
}));

interface RoomProps {
	devices: Device[];
}
function RoomWidget({ devices }: RoomProps) {
	const classes = useStyles();

	const location = devices[0].info.location;

	return (
		<Paper className={classes.widget} elevation={3}>
			{location.building + "/" + location.room}
		</Paper>
	);
}

export default RoomWidget;
