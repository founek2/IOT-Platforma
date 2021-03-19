import React, { Fragment, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import AddCircle from "@material-ui/icons/AddCircle";
import { connect } from "react-redux";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import Loader from "framework-ui/lib/Components/Loader";
import { bindActionCreators } from "redux";
import { clone } from "ramda";

import { getFormData } from "framework-ui/lib/utils/getters";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import EditNotify from "./editNotifyForm/EditNotify";
import Typography from "@material-ui/core/Typography";
import * as deviceActions from "../store/actions/application/devices";
import * as userActions from "../store/actions/application/user";
import { getToken } from "../firebase";
import { getNotify } from "../api/deviceApi";
import { IDevice } from "common/lib/models/interface/device";
import { IThing } from "common/lib/models/interface/thing";
import { IState } from "../types";
import { getDevices } from "../utils/getters";

const useStyles = makeStyles((theme) => ({
	textField: {
		width: 200,
		[theme.breakpoints.down("sm")]: {
			width: "80%",
		},
	},
	unit: {
		width: 100,
		[theme.breakpoints.down("sm")]: {
			width: "80%",
		},
	},
	fileLoader: {
		width: "100%",
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
		[theme.breakpoints.down("sm")]: {
			width: "80%",
		},
	},
	card: {
		overflow: "auto",
		margin: "0px auto",
		position: "relative",
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		width: 650,
		marginTop: 0,

		[theme.breakpoints.down("sm")]: {
			width: "100%",
			//height: '100%'
		},
		[theme.breakpoints.down("xs")]: {
			width: "100%",
		},
		[theme.breakpoints.up("lg")]: {
			//height: 410
		},
	},
	actions: {
		marginBottom: theme.spacing(2),
		[theme.breakpoints.up("sm")]: {
			marginTop: theme.spacing(2),
		},
		margin: "auto",
		width: 400,
		justifyContent: "center",

		[theme.breakpoints.down("sm")]: {
			width: "100%",
			justifyContent: "flex-start",
			flexDirection: "column",
		},
	},
	header: {
		paddingBottom: 0,
		paddingTop: theme.spacing(4),
		textAlign: "center",
	},
	content: {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(6),
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column",
			textAlign: "center",
			paddingLeft: theme.spacing(1),
			paddingRight: theme.spacing(1),
		},
	},
}));

const FIELDS = ["propertyId", "type", "value", "interval"];
const formName = "EDIT_NOTIFY";

interface EditDeviceDialogProps {
	updateSensorCount: any;
	fillEditFormAction: any;
	editForm: any;
	sensorCount?: number;
	preFillForm: any;
	onUpdate: any;
	registerTokenAction: any;
	match: { params: { deviceId: IDevice["_id"]; nodeId: IThing["config"]["nodeId"] } };
	device?: IDevice;
	thing?: IThing;
	onSaveAction: any;
}

function EditDeviceDialog({
	updateSensorCount,
	fillEditFormAction,
	editForm,
	sensorCount = 0,
	onUpdate,
	registerTokenAction,
	match: { params },
	preFillForm,
	device,
	onSaveAction,
	thing,
}: EditDeviceDialogProps) {
	const [pending, setPending] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const classes = useStyles();
	console.log("match", params);
	useEffect(() => {
		async function preFill() {
			setPending(true);
			const success = await preFillForm(params.deviceId, params.nodeId);
			if (success) setLoaded(true);
			setPending(false);
		}

		async function sendToken() {
			const token = await getToken();
			console.log("getting token: ", token);
			registerTokenAction(token);
		}
		preFill();
		sendToken();
	}, []);

	function removeSensorByIndex(idx: number) {
		const newEditForm = clone(editForm);
		for (let i = idx + 1; i < sensorCount; i++) {
			FIELDS.forEach((key) => {
				if (newEditForm[key]) newEditForm[key][i - 1] = editForm[key][i];
			});
		}
		FIELDS.forEach((key) => {
			if (newEditForm[key] && idx < newEditForm[key].length) newEditForm[key].pop();
		});

		newEditForm.count = sensorCount - 1;
		fillEditFormAction(newEditForm);
	}

	const handleSave = async () => {
		setPending(true);
		await onSaveAction(params.deviceId, params.nodeId);
		setPending(false);
	};

	return loaded && thing?.config ? (
		<Card className={classes.card}>
			<CardHeader className={classes.header} titleTypographyProps={{ variant: "h3" }} />
			<CardContent className={classes.content}>
				<div>
					{/* <Typography variant="subtitle1" align="center" >Notifikace:</Typography> */}
					{sensorCount > 0 &&
						[...Array(sensorCount).keys()].map((i) => (
							<EditNotify id={i} key={i} onDelete={removeSensorByIndex} config={thing.config} />
						))}
				</div>
				<IconButton aria-label="Add a sensor" onClick={() => updateSensorCount(sensorCount + 1)}>
					<AddCircle />
				</IconButton>
			</CardContent>
			<CardActions className={classes.actions}>
				<Button color="primary" variant="contained" onClick={handleSave} disabled={pending}>
					Uložit
				</Button>
				<Loader open={pending} />
			</CardActions>
		</Card>
	) : pending ? (
		<Loader open={pending} />
	) : (
		<Typography>Nelze načíst data</Typography>
	);
}

const _mapStateToProps = (state: IState, { match: { params } }: EditDeviceDialogProps) => {
	const editForm: any = getFormData("EDIT_NOTIFY")(state);
	const sensorCount = editForm ? editForm.count : undefined;
	const device = (getDevices(state) as IDevice[]).find((obj) => obj._id === params.deviceId);
	const thing = device?.things.find((thing) => thing.config.nodeId === params.nodeId);
	return {
		sensorCount,
		editForm,
		device,
		thing,
	};
};

const _mapDispatchToProps = (dispatch: any) => ({
	...bindActionCreators(
		{
			updateSensorCount: formsActions.updateFormField("EDIT_NOTIFY.count"),
			fillEditFormAction: formsActions.fillForm("EDIT_NOTIFY"),
			preFillForm: deviceActions.prefillNotify,
			onSaveAction: deviceActions.updateNotify,
			registerTokenAction: userActions.registerToken,
		},
		dispatch
	),
});

export default connect(_mapStateToProps, _mapDispatchToProps)(EditDeviceDialog);
