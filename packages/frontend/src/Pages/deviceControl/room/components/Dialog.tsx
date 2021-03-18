import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useMediaQuery } from "@material-ui/core";
import { IDevice } from "common/lib/models/interface/device";
import { IThing } from "common/lib/models/interface/thing";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
	avatar: {
		backgroundColor: blue[100],
		color: blue[600],
	},
	closeButton: {
		marginRight: 10,
	},
	moreButton: {
		float: "right",
	},
});

export interface SimpleDialogProps {
	open: boolean;
	onClose: (value: any) => void;
	title: string;
	deviceId: IDevice["_id"];
	thing: IThing;
	children: (JSX.Element | null)[] | JSX.Element | null;
}

export function SimpleDialog({ onClose, open, title, children, deviceId, thing }: SimpleDialogProps) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("md"));

	const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMoreClose = () => {
		setAnchorEl(null);
	};

	return (
		<Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open} fullWidth fullScreen={isSmall}>
			<DialogTitle id="simple-dialog-title">
				<IconButton onClick={onClose} className={classes.closeButton}>
					<CloseIcon />
				</IconButton>
				{title}
				<IconButton onClick={handleMoreClick} className={classes.moreButton}>
					<MoreVertIcon />
				</IconButton>
			</DialogTitle>
			{children}
			<Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMoreClose}>
				<Link to={"/device/" + deviceId + "/thing/" + thing.config.nodeId + "/notify"}>
					<MenuItem onClick={handleMoreClose}>Notifikace</MenuItem>
				</Link>
				{/* <MenuItem onClick={handleMoreClose}>My account</MenuItem>
				<MenuItem onClick={handleMoreClose}>Logout</MenuItem> */}
			</Menu>
		</Dialog>
	);
}
