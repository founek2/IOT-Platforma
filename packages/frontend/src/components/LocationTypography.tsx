import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { Device } from "common/lib/models/interface/device";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	buildingTitle: {
		flex: "1 0 100%",
		marginTop: 10,
		textAlign: "center",
		color: grey[700],
	},
}));

interface LocationTypographyProps {
	location: {
		building: string;
		room?: string;
	};
	linkBuilding?: boolean;
}

export function LocationTypography({ location, linkBuilding }: LocationTypographyProps) {
	const classes = useStyles();
	const linkToRoot = (
		<Link
			to={{
				search: "",
			}}
		>
			/
		</Link>
	);
	const linkToBuilding = (
		<Link
			to={{
				search: `?building=${location.building}`,
			}}
		>
			{location?.building}
		</Link>
	);

	return (
		<Typography className={classes.buildingTitle} variant="h4">
			{!linkBuilding && linkToRoot}
			{linkToBuilding}

			{!linkBuilding && location.room && "/" + location.room}
		</Typography>
	);
}
