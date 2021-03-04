import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import boxHoc from "./components/boxHoc";
import ControlContextMenu from "./components/ControlContextMenu";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { ReactComponent as ThermometrIcon } from "./sensor/thermometr.svg";
import { ReactComponent as HumidityIcon } from "./sensor/humidity.svg";
import { ReactComponent as VoltageIcon } from "./sensor/voltage.svg";
import { ReactComponent as BarometrIcon } from "./sensor/barometer.svg";
import { DeviceClass, IThing } from "common/lib/models/schema/thing";

const icons = {
	[DeviceClass.Humidity]: HumidityIcon,
	[DeviceClass.Temperature]: ThermometrIcon,
	[DeviceClass.Voltage]: VoltageIcon,
	[DeviceClass.Pressure]: BarometrIcon,
};

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
	const Icon = icons[config.deviceClass as DeviceClass];
	console.log("Data", data);
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
