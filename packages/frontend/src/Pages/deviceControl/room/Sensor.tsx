import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import boxHoc from "./components/boxHoc";
import ControlContextMenu from "./components/ControlContextMenu";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { DeviceClass, IThing } from "common/lib/models/interface/thing";
import { SensorIcons } from "frontend/src/components/SensorIcons";

const useStyles = makeStyles({
	root: {
		display: "flex",
		flexDirection: "column",
		textAlign: "center",
	},
	header: {
		height: "1.7em",
		overflow: "hidden",
		userSelect: "none",
	},
	circle: {
		top: 3,
		right: 3,
		position: "absolute",
	},
	container: {
		fontSize: 25,
		marginTop: 10,
	},
	icon: {
		marginRight: 5,
	},
});

interface ActivatorProps {
	onClick: any;
	data: any;
	ackTime: Date;
	afk: any;
	pending: boolean;
	id: string;
	config: IThing["config"];
}
function Activator({ onClick, data, ackTime, afk, pending, id, config }: ActivatorProps) {
	const classes = useStyles();
	const Icon = SensorIcons[config.deviceClass as DeviceClass];

	return (
		<ControlContextMenu
			name={config.name}
			id={id}
			// JSONkey={JSONkey}
			render={({ handleOpen }: any) => {
				return (
					<div className={classes.root}>
						<Typography className={classes.header} onContextMenu={handleOpen}>
							{config.name}
						</Typography>

						<div className={classes.container}>
							<Icon className={classes.icon} />
							<Typography component="span">
								{data || "??"} {config.unitOfMeasurement}
							</Typography>
						</div>
					</div>
				);
			}}
		/>
	);
}

export default boxHoc(Activator);
