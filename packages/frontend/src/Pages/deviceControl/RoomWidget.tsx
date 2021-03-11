import { makeStyles, Paper, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import clsx from "clsx";
import { Device } from "common/lib/models/interface/device";
import { ComponentType, DeviceClass, IThing, IThingProperty } from "common/lib/models/interface/thing";
import { SensorIcons } from "frontend/src/components/SensorIcons";
import React from "react";

const useStyles = makeStyles((theme) => ({
	widget: {
		display: "flex",
		padding: theme.spacing(4),
		borderRadius: "1em",
	},
	title: {
		color: grey[700],
		paddingRight: 10,
		// width: "100%",
	},
	sensorsGrid: {
		display: "flex",
		flexWrap: "wrap",
		flexGrow: 1,
	},
	sensorContainer: {
		flex: "1 0 22%",
		margin: 10,
	},
	sensorIcon: {
		verticalAlign: "middle",
		fontSize: 20,
		marginRight: 5,
	},
	center: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
}));
type IThingPropertyWithDeviceClass = IThingProperty & { deviceClass: DeviceClass };
interface SimpleSensorProps {
	thing: IThing;
	property: IThingPropertyWithDeviceClass;
}
function SimpleSensor({ thing, property }: SimpleSensorProps) {
	const classes = useStyles();
	const Icon = SensorIcons[property.deviceClass];

	const value = thing.state?.value && thing.state?.value[property.propertyId];

	if (!value) return null;

	return (
		<div className={clsx(classes.sensorContainer, classes.center)}>
			<Icon className={classes.sensorIcon} />
			<Typography component="span">
				{value}&nbsp;{property.unitOfMeasurement}
			</Typography>
		</div>
	);
}

interface RoomProps {
	devices: Device[];
	className?: string;
}
function RoomWidget({ devices, className }: RoomProps) {
	const classes = useStyles();

	const location = devices[0].info.location;

	const sensors: JSX.Element[] = [];
	devices.forEach((device) => {
		device.things.forEach((thing) => {
			if (thing.config.componentType === ComponentType.Sensor)
				thing.config.properties.forEach((property) => {
					if (property.deviceClass)
						sensors.push(
							<SimpleSensor
								thing={thing}
								property={property as IThingPropertyWithDeviceClass}
								key={thing._id}
							/>
						);
				});
		});
	});
	return (
		<Paper className={clsx(className, classes.widget)} elevation={3}>
			<Typography variant="h3" className={clsx(classes.title, classes.center)}>
				{location.room}
			</Typography>
			<div className={classes.sensorsGrid}>{sensors}</div>
		</Paper>
	);
}

export default RoomWidget;
