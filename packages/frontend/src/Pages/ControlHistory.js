import React, { Fragment, useEffect, useMemo } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { connect } from "react-redux";
import { filter, not, isNil } from "ramda";
import { bindActionCreators } from "redux";
import { getDevices, getControl, getQueryField } from "../utils/getters";
import * as deviceActions from "../store/actions/application/devices";
import * as controlActions from "../store/actions/application/devices/control";
import Typography from "@material-ui/core/Typography";
import DetailTable from "./controlHistory/DetailTable";
import resetTime from "common/lib/utils/resetTime";

import Chart from "../components/Chart";

function writableWithControl(device) {
	return device.permissions && device.permissions.control && device.control && device.control.recipe;
}

const styles = (theme) => ({
	noDevices: {
		padding: 10,
	},
	title: {
		padding: 15,
		color: "#5c6b73",
	},
	root: {
		paddingBottom: 20,
	},
});

function transformData(controlData, controlRecipe, JSONkey) {
	const arr = [["Čas"]];
	const keys = [];

	const { name, type } = controlRecipe.find(({ JSONkey: key }) => key === JSONkey);
	arr[0].push(name);
	keys.push("on");

	const dataTable = [];
	let id = 0;
	// DATA for Graph
	controlData.forEach(({ samples, nsamples, timestamps, day, sum, min, max }) => {
		const len = timestamps.length;
		for (let i = 0; i < len; ++i) {
			const newArr = [new Date(timestamps[i])];
			for (let j = 0; j < keys.length; j++) {
				const key = keys[j];
				if (not(isNil(samples[i][key]))) {
					newArr[j + 1] = Number(samples[i][key]); // on index 0 is timestamp
				} else {
					newArr[j + 1] = null; // on index 0 is timestamp
				}
			}
			arr.push(newArr);
			dataTable.push({ ...samples[i], timestamp: timestamps[i], id: id++ });
		}
	});
	return [arr, dataTable];
}

function ControlHistory({
	fetchDevicesAction,
	fetchControlDataAction,
	device,
	match: { params },
	classes,
	control,
	JSONkey,
}) {
	useEffect(() => {
		const from = new Date();
		from.setDate(from.getDate() - 7); // Go 7 days back

		if (!device) {
			fetchDevicesAction();
			fetchControlDataAction(params.deviceId, JSONkey)(resetTime(from));
		} else fetchControlDataAction(params.deviceId, JSONkey)(resetTime(from));
	}, []);

	const hasData = device && control && control.id === device.id && control.data && control.data.length;

	// memoize data, because it always fetches new one, even if they are same
	const [dataArray, dataTable] = useMemo(
		() => (hasData ? transformData(control.data, device.control.recipe, JSONkey) : []),
		[hasData && control.data[0].first, hasData && control.data[control.data.length - 1].last]
	); // check from -> to
	const controlRecipe = device && device.control.recipe.find(({ JSONkey: key }) => JSONkey === key);
	return (
		<Fragment>
			{device && controlRecipe ? (
				<Card className={classes.root}>
					<Typography className={classes.title} variant="h3" align="center">
						{device.info.title}
					</Typography>
					{hasData ? ( // Chart needs two points to draw a line
						<Fragment>
							<Chart
								data={dataArray}
								vAxisTitle={"Stav"}
								hAxisTitle="Čas"
								chartType="ScatterChart"
								minValue={0}
							/>
							<DetailTable data={dataTable || []} controlRecipe={controlRecipe} />
						</Fragment>
					) : (
						<Typography className={classes.noDevices}>Nebyla nalezena žádná historická data</Typography>
					)}
				</Card>
			) : (
				<Typography className={classes.noDevices}>Nebylo nalezeno vámi zvolené zařízení</Typography>
			)}
		</Fragment>
	);
}

const _mapStateToProps = (state, { match: { params } }) => {
	const devices = filter(writableWithControl, getDevices(state));
	return {
		device: devices.find((dev) => dev.id === params.deviceId),
		control: getControl(state),
		JSONkey: getQueryField("JSONkey", state),
	};
};

const _mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			fetchDevicesAction: deviceActions.fetch,
			fetchControlDataAction: controlActions.fetchData,
		},
		dispatch
	);

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(ControlHistory));
