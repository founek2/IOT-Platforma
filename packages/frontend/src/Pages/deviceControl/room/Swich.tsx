import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import switchCss from "./components/switch/css";
import boxHoc from "./components/boxHoc";
import ControlContextMenu from "./components/ControlContextMenu";
import { BoxWidgetProps } from "./components/BorderBox";

const useStyles = makeStyles((theme) => ({
	...switchCss(theme),
	root: {
		display: "flex",
		flexDirection: "column",
	},
	header: {
		height: "3em", // I hope it is for 2 lines
		overflow: "hidden",
		textAlign: "center",
		userSelect: "none",
	},
}));

function MySwitch({ onClick, deviceId, thing, room, fetchHistory, disabled }: BoxWidgetProps) {
	const classes = useStyles();
	const { power } = thing.state?.value || { power: "off" };
	const { config } = thing;

	return (
		<ControlContextMenu
			name={config.name}
			//  JSONkey={JSONkey}
			render={({ handleOpen }: any) => {
				return (
					<div
						className={classes.root}
						onClick={(e) => !disabled && onClick({ power: power === "on" ? "off" : "on" })}
					>
						<div className={classes.header} onContextMenu={handleOpen}>
							<Typography component="span">{config.name}</Typography>
						</div>
						<div className={classes.switchContainer}>
							<Switch
								focusVisibleClassName={classes.focusVisible}
								disableRipple
								classes={{
									root: classes.switchRoot,
									switchBase: classes.switchBase,
									thumb: classes.thumb,
									track: classes.track,
									checked: classes.checked,
									disabled: classes.disabled,
								}}
								disabled={disabled}
								// onClick={handleClick}
								checked={power === "on"}
							/>
						</div>
					</div>
				);
			}}
		/>
	);
}

export const Content = MySwitch;

export default boxHoc(Content);
