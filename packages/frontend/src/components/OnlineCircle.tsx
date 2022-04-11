import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { DeviceStatus, IDeviceStatus } from "common/lib/models/interface/device";
import React, { useState } from "react";
import getCircleColor, { CircleColors, getCircleTooltipText } from "../utils/getCircleColor";
import {format} from "frontend/src/utils/date-fns"

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

type CircleComponentProps ={
	color: CircleColors;
	className?: string;
}& React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
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
	const [showDate, setShowDate ] = useState(false)
	
	const titleText = status?.timestamp
	? getCircleTooltipText(inTransition, status.value)
	: "Zařízení nikdy nebylo připojeno";

	const titleDate = status?.timestamp
	? format(new Date(status.timestamp), "d. L. yyyy H:mm")
	: "?. ?. ????";

	const title = showDate ? titleDate: titleText

	return (
		<Tooltip title={title} placement="bottom" arrow={true}>
			<CircleComponent 
			color={getCircleColor(inTransition, status?.value || DeviceStatus.disconnected)}
			 className={className}
			 onClick={() => setShowDate(!showDate)}
			  />
		</Tooltip>
	);
}

export default Circle;
