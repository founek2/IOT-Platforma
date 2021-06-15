import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { IDevice } from 'common/lib/models/interface/device';
import { IDiscovery } from 'common/lib/models/interface/discovery';
import * as formsActions from 'framework-ui/lib/redux/actions/formsData';
import { isUrlHash, getApplication } from 'framework-ui/lib/utils/getters';
import { equals, filter, o, prop, path } from 'ramda';
import React, { Fragment, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as deviceActions from '../store/actions/application/devices';
import { IState } from '../types';
import { getDevices, getDiscovery, getQueryField, getQueryID } from '../utils/getters';
import io from '../webSocket';
import DeviceSection from './deviceManagement/DeviceSection';
import DiscoverySection from './deviceManagement/DiscoverySection';
import { useEffectFetchDevices } from '../hooks/useEffectFetchDevices';
import { discoveryActions } from '../store/actions/application/discovery';

const useStyles = makeStyles((theme) => ({
    cardContent: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

interface DevicesProps {
    devices: IDevice[];
    discoveredDevices: IDiscovery[];
}

function Devices({ devices, discoveredDevices }: DevicesProps) {
    const classes = useStyles();
    const dispatch = useDispatch();
    useEffectFetchDevices();

    useEffect(() => {
        dispatch(discoveryActions.fetch());
        function addDiscoveredDevice(device: IDiscovery) {
            dispatch(discoveryActions.add(device));
        }

        io.getSocket().on('deviceDiscovered', addDiscoveredDevice);

        return () => {
            io.getSocket().off('deviceDiscovered', addDiscoveredDevice);
        };
    }, [dispatch]);

    return (
        <Fragment>
            <Card>
                {/* <CardHeader title="Správa zařízení" /> */}
                <div className={classes.cardContent}>
                    <DiscoverySection discoveredDevices={discoveredDevices} />
                    <DeviceSection devices={devices} />
                </div>
                <CardActions />
            </Card>
        </Fragment>
    );
}

const _mapStateToProps = (state: IState) => {
    const deviceId = getQueryField('deviceId')(state);
    // @ts-ignore
    const discoveredDevices = prop('data', getDiscovery(state)) as IState['application']['discovery']['data'];
    // @ts-ignore
    const toAddDevice = discoveredDevices.find(o(equals(deviceId), prop('deviceId')));
    const devices = getDevices(state);
    return {
        devices,
        discoveredDevices: discoveredDevices,
        toAddDevice,
    };
};

export default connect(_mapStateToProps)(Devices);
