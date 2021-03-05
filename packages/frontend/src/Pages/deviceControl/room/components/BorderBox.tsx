import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import OnlineCircle from "../../../../components/OnlineCircle";
import isAfk from "../../../../utils/isAfk";
import forceUpdateHoc from "framework-ui/lib/Components/forceUpdateHoc";
import ControlDetail from "./borderBox/ControlDetail";
import Loader from "framework-ui/lib/Components/Loader";
import { IThing } from "common/lib/models/interface/thing";
import { Device, IDeviceStatus } from "common/lib/models/interface/device";

const useStyles = makeStyles({
	circle: {
		top: 3,
		right: 3,
		position: "absolute",
	},
	contextMenu: {
		width: "20%",
		height: "20%",
		position: "absolute",
		right: 0,
		bottom: 0,
	},
});

const defaultProps = {
	bgcolor: "background.paper",
	m: 1,
	border: 1,
	style: { padding: "1rem" },
	position: "relative",
};

interface BorderBoxProps {
	component: any;
	className?: string;
	config: IThing["config"];
	data: any;
	onClick: any;
	deviceStatus: IDeviceStatus;
}
function BorderBox({ className, data, onClick, component, deviceStatus, ...other }: BorderBoxProps) {
	const classes = useStyles();
	const [detailOpen, setOpen] = useState(false);
	const [pending, setPending] = useState(false);

	async function handleClick(newState: any) {
		setPending(true);
		await onClick(newState);
		setPending(false);
	}

	function handleContext(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		e.preventDefault();
		setOpen(true);
	}

	const { inTransition, updatedAt } = data || {};
	const afk = deviceStatus && isAfk(deviceStatus.value);
	const Component = component;
	return (
		<Box
			display="inline-block"
			borderRadius={10}
			borderColor="grey.400"
			className={className ? className : ""}
			{...defaultProps}
		>
			<OnlineCircle inTransition={inTransition} className={classes.circle} status={deviceStatus} />
			<Component data={data} onClick={handleClick} pending={pending} afk={Boolean(afk)} {...other} />
			<Loader open={pending} className="marginAuto" />
			<div onContextMenu={handleContext} className={classes.contextMenu}></div>
			{/* <ControlDetail
				open={detailOpen}
				data={data}
				handleClose={() => setOpen(false)}
			/> */}
		</Box>
	);
}

export default forceUpdateHoc(BorderBox);
