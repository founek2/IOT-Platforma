import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Loader from "./Loader";
import { withStyles } from "@material-ui/core/styles";

const styles = {
	loader: {
		position: "absolute",
	},
	agreeButton: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
};

function AlertDialog({
	onAgree,
	classes,
	onClose,
	open,
	title,
	content,
	cancelText,
	agreeText = "Souhlasím",
	disablePending = false,
}) {
	const [pending, setPending] = useState(false);
	async function handleAgree(e) {
		if (!disablePending) setPending(true);
		await onAgree(e);
		if (!disablePending) setPending(false);
	}
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent>
				{typeof content == "string" ? (
					<DialogContentText id="alert-dialog-description">{content}</DialogContentText>
				) : (
					content
				)}
			</DialogContent>
			<DialogActions>
				{cancelText ? (
					<Button onClick={onClose} color="primary">
						{cancelText}
					</Button>
				) : null}
				<div className={classes.agreeButton}>
					<Button onClick={handleAgree} color="primary" autoFocus disabled={pending}>
						{agreeText}
					</Button>
					<Loader open={pending} className={classes.loader} />
				</div>
			</DialogActions>
		</Dialog>
	);
}

export default withStyles(styles)(AlertDialog);
