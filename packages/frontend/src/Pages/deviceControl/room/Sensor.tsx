import React, { useEffect, useMemo } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import boxHoc from "./components/boxHoc";
import ControlContextMenu from "./components/ControlContextMenu";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { DeviceClass, IThing } from "common/lib/models/interface/thing";
import { SensorIcons } from "../../../components/SensorIcons";
import { SimpleDialog } from "./components/Dialog";
import ChartSimple from "frontend/src/components/ChartSimple";
import { useSelector } from "react-redux";
import { getThingHistory } from "../../../utils/getters";
import { IState } from "frontend/src/types";
import { BoxWidgetProps } from "./components/BorderBox";
import { HistoricalSensor } from "common/lib/models/interface/history";

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

function Activator({ onClick, deviceId, thing, room, fetchHistory }: BoxWidgetProps) {
	const classes = useStyles();
	const [openDialog, setOpenDialog] = React.useState(false);
	const historyData = useSelector<IState, IState["application"]["thingHistory"]>(getThingHistory as any);

	const Icon = thing.config.deviceClass ? SensorIcons[thing.config.deviceClass] : null;
	const title = room + " - " + thing.config.name!;

	useEffect(() => {
		if (openDialog) fetchHistory();
	}, [openDialog]);
	const chartData = useMemo(() => mergeData(historyData.data, thing.config.propertyId), [
		historyData.data,
		thing.config.propertyId,
	]);

	return (
		<ControlContextMenu
			name={thing.config.name}
			// JSONkey={JSONkey}
			render={({ handleOpen }: any) => {
				return (
					<div className={classes.root}>
						<Typography
							className={classes.header}
							onContextMenu={handleOpen}
							onClick={() => setOpenDialog(true)}
						>
							{thing.config.name}
						</Typography>

						<div className={classes.container}>
							{Icon ? <Icon className={classes.icon} /> : null}
							<Typography component="span">
								{thing.state?.value || "??"} {thing.config.unitOfMeasurement}
							</Typography>
						</div>
						<SimpleDialog open={openDialog} onClose={() => setOpenDialog(false)} title={title}>
							{Icon ? <Icon className={classes.icon} /> : null}
							<Typography>
								{room +
									" " +
									thing.config.name +
									" " +
									thing.state?.value +
									" " +
									thing.config.unitOfMeasurement}
							</Typography>
							{historyData.deviceId === deviceId && historyData.thingId === thing._id ? (
								<ChartSimple data={[[{ type: "date", label: "Čas" }, title], ...chartData]} />
							) : null}
						</SimpleDialog>
					</div>
				);
			}}
		/>
	);
}

export default boxHoc(Activator);

function mergeData(data: HistoricalSensor[], propertyId: IThing["config"]["propertyId"]) {
	if (!propertyId) return [];

	let result: Array<[Date, number]> = [];
	data.forEach((doc) => {
		if (doc.properties[propertyId])
			result = result.concat(
				doc.properties[propertyId].samples.map((rec) => [new Date(rec.timestamp), rec.value])
			);
	});

	return result;
}
