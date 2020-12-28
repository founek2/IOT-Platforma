import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { filter, isEmpty } from 'ramda';
import { bindActionCreators } from 'redux';
import { Typography } from '@material-ui/core';
import FullScreenDialog from 'framework-ui/lib/Components/FullScreenDialog';
import isBefore from 'date-fns/isBefore';
import subSeconds from 'date-fns/subSeconds';

import io from '../webSocket';
import RgbSwitch from './deviceControl/RgbSwitch';
import { ControlTypesFormNames } from '../constants';
import { CONTROL_TYPES } from 'common/lib/constants';
import { isUrlHash, getUserPresence } from 'framework-ui/lib/utils/getters';
import { getQueryID, getQueryField, getDevicesLastUpdate } from '../utils/getters';
import * as deviceActions from '../store/actions/application/devices';
import Switch from './deviceControl/Swich';
import Activator from './deviceControl/Activator';
import { getDevices } from '../utils/getters';
import { errorLog } from 'framework-ui/lib/logger';
import EditNotifyForm from '../components/EditNotifyForm';
import * as formsActions from 'framework-ui/lib/redux/actions/formsData';
import * as controlActions from '../store/actions/application/devices/control';
import MusicCast from './deviceControl/MusicCast';

const compMapper = {
	[CONTROL_TYPES.ACTIVATOR]: Activator,
	[CONTROL_TYPES.SWITCH]: Switch,
	[CONTROL_TYPES.RGB_SWITCH]: RgbSwitch,
	[CONTROL_TYPES.MUSIC_CAST]: MusicCast
};

function isControllable(device) {
	return device.permissions && device.permissions.control && device.control && device.control.recipe;
}

const styles = (theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	item: {
		width: 150,
		[theme.breakpoints.down('sm')]: {
			width: `calc(50% - ${theme.spacing(1.5)}px)`, // to add spacing to right
			margin: `${theme.spacing(1)}px 0 0 ${theme.spacing(1)}px`
		}
	}
});

function updateDevice(updateDeviceAction) {
	return ({ data, deviceID, updatedAt }) => {
		console.log('web socket GOT');
		const updateObj = {
			id: deviceID,
			ack: updatedAt
		};
		if (data) updateObj.control = { current: { data } };

		updateDeviceAction(updateObj);
	};
}

function DeviceControl({
	classes,
	devices,
	fetchDevicesAction,
	updateDeviceStateA,
	updateDeviceAction,
	fetchControlAction,
	openNotifyDialog,
	selectedDevice,
	history,
	resetEditNotifyControlA,
	updateNotifyControlA,
	prefillNotifyControlA,
	JSONkey,
	devicesLastUpdate
}) {
	useEffect(
		() => {
			fetchDevicesAction();

			const listener = updateDevice(updateDeviceAction);
			io.getSocket().on('control', listener);

			const listenerAck = updateDevice(updateDeviceAction);
			io.getSocket().on('ack', listenerAck);

			return () => {
				io.getSocket().off('control', listener);
				io.getSocket().off('ack', listenerAck);
			};
		},
		[ fetchDevicesAction, updateDeviceAction ]
	);

	useEffect(
		() => {
			const handler = () => {
				if (isBefore(new Date(devicesLastUpdate), subSeconds(new Date(), 30))) fetchControlAction();
			};
			const listenConnect = () => {
				console.log('connect');
				window.removeEventListener('focus', handler);
			};
			const listenDisconnect = () => {
				console.log('disconnected');
				window.addEventListener('focus', handler);
			};

			io.getSocket().on('disconnect', listenDisconnect);
			io.getSocket().on('connect', listenConnect);

			return () => {
				io.getSocket().off('disconnect', listenDisconnect);
				io.getSocket().off('connect', listenConnect);
			};
		},
		[ fetchControlAction, devicesLastUpdate ]
	);

	const arr = [];
	devices.forEach((device) => {
		device.control.recipe.forEach(({ name, type, JSONkey, description }) => {
			const Comp = compMapper[type];
			if (Comp) {
				const data =
					(device.control.current &&
						device.control.current.data[JSONkey] &&
						device.control.current.data[JSONkey]) ||
					{};
				arr.push(
					<Comp
						key={`${device.id}/${JSONkey}`}
						name={name}
						description={description}
						onClick={(val) => updateDeviceStateA(device.id, JSONkey, val, ControlTypesFormNames[type])}
						data={data}
						className={classes.item}
						ackTime={device.ack}
						updateTime={device.ack} // to force updating
						id={device.id}
						JSONkey={JSONkey}
					/>
				);
			} else errorLog('Invalid component type:', type, 'of device:', device.info.title);
		});
	});

	return (
		<div className={classes.root}>
			{isEmpty(arr) ? <Typography>Nebyla nalezena žádná zařízení</Typography> : arr}
			<FullScreenDialog
				open={openNotifyDialog && !!selectedDevice}
				onClose={() => history.push({ hash: '', search: '' })}
				onExited={resetEditNotifyControlA}
				heading="Editace notifikací"
			>
				<EditNotifyForm
					device={selectedDevice}
					formName="EDIT_NOTIFY_CONTROL"
					onUpdate={updateNotifyControlA}
					onPrefill={(id) => prefillNotifyControlA(id, JSONkey)}
					JSONkey={JSONkey}
				/>
			</FullScreenDialog>
		</div>
	);
}

const _mapStateToProps = (state) => {
	const id = getQueryID(state);
	const JSONkey = getQueryField('JSONkey', state);
	const devices = filter(isControllable, getDevices(state));
	return {
		devices,
		openNotifyDialog: isUrlHash('#editNotify')(state),
		selectedDevice: devices.find((dev) => dev.id === id),
		isUserPresent: getUserPresence(state),
		devicesLastUpdate: getDevicesLastUpdate(state),
		JSONkey
	};
};

const _mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			fetchDevicesAction: deviceActions.fetch,
			updateDeviceStateA: deviceActions.updateState,
			updateDeviceAction: deviceActions.update,
			fetchControlAction: deviceActions.fetchControl,
			resetEditNotifyControlA: formsActions.removeForm('EDIT_NOTIFY_SENSORS'),
			updateNotifyControlA: controlActions.updateNotify,
			prefillNotifyControlA: controlActions.prefillNotify
		},
		dispatch
	);

export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(DeviceControl));
