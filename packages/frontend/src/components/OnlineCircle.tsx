import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import getLastUpdateText from "framework-ui/lib/utils/getLastUpdateText";
import getCircleColor, { CircleColors, getCircleTooltipText } from "../utils/getCircleColor";
import { grey } from "@material-ui/core/colors";
import { Device, IDeviceStatus, DeviceStatus } from "common/lib/models/interface/device";

const useStyles = makeStyles({
	wrapper: {
		width: 22,
		height: 22,
		borderRadius: "50%",
		display: "inline-block",
	},
	circle: {
		width: 10,
		height: 10,
		borderRadius: "50%",
		marginLeft: 6,
		marginTop: 6,
	},
	green: {
		backgroundColor: "#62bd19",
	},
	red: {
		backgroundColor: "#cd0000",
	},
	orange: {
		backgroundColor: "#e08d0f",
	},
	grey: {
		backgroundColor: grey[400],
	},
});

interface CircleComponentProps {
	color: CircleColors;
	className?: string;
}
const CircleComponent = React.forwardRef(function ({ color, className, ...props }: CircleComponentProps, ref: any) {
	const classes = useStyles();
	return (
		<div {...props} ref={ref} className={`${classes.wrapper} ${className ? className : ""}`}>
			<div className={`${classes.circle} ${classes[color]}`} />
		</div>
	);
});

interface CircleProps {
	status: IDeviceStatus;
	className?: string;
	inTransition: boolean;
}
function Circle({ status, className, inTransition }: CircleProps) {
	if (!status)
		return (
			<Tooltip title="Nikdy nebylo připojeno" placement="bottom" arrow={true}>
				<CircleComponent
					color={getCircleColor(inTransition, DeviceStatus.Disconnected)}
					className={className}
				/>
			</Tooltip>
		);

	const title = status?.timestamp
		? getCircleTooltipText(inTransition, status.value)
		: "Zařízení nikdy nebylo připojeno";
	return (
		<Tooltip title={title} placement="bottom" arrow={true}>
			<CircleComponent color={getCircleColor(inTransition, status.value)} className={className} />
		</Tooltip>
	);
}

export default Circle;
