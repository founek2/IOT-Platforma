import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles({
	avatar: {
		backgroundColor: blue[100],
		color: blue[600],
	},
});

export interface SimpleDialogProps {
	open: boolean;
	onClose: (value: string) => void;
	title: string;
	children: (JSX.Element | null)[] | JSX.Element | null;
}

export function SimpleDialog({ onClose, open, title, children }: SimpleDialogProps) {
	const classes = useStyles();

	return (
		<Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open} fullWidth>
			<DialogTitle id="simple-dialog-title">{title}</DialogTitle>
			{children}
		</Dialog>
	);
}
