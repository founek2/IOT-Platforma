import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { IDevice } from 'common/src/models/interface/device';
import { IDiscovery } from 'common/src/models/interface/discovery';
import { Discovery } from '../store/reducers/application/discovery';
import { Locations } from 'frontend/src/types';
import { prop } from 'ramda';
import React, { Fragment, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import { useEffectFetchDevices } from '../hooks/useEffectFetchDevices';
import { discoveryActions } from '../store/actions/application/discovery';
import { locationsSelector } from '../store/selectors/deviceSelector';
import { RootState } from '../store/store';
import { getDevices, getDiscovery } from '../utils/getters';
import io from '../webSocket';
import DeviceSection from './deviceManagement/DeviceSection';
import DiscoverySection from './deviceManagement/DiscoverySection';
import { Device } from '../store/reducers/application/devices';

const useStyles = makeStyles((theme) => ({
    cardContent: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

export interface DevicesProps {
    devices: Device[];
    discoveredDevices: IDiscovery[];
    locations: Locations;
}

function Devices({ discoveredDevices }: DevicesProps) {
    const devices = useAppSelector(getDevices);
    const locations = useAppSelector(locationsSelector);
    const classes = useStyles();
    const dispatch = useDispatch();
    useEffectFetchDevices();

    useEffect(() => {
        dispatch(discoveryActions.fetch());
        function addDiscoveredDevice(device: Discovery) {
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
                    <DiscoverySection discoveredDevices={discoveredDevices} locations={locations} />
                    <DeviceSection devices={devices} />
                </div>
                <CardActions />
            </Card>
        </Fragment>
    );
}

const _mapStateToProps = (state: RootState) => {
    // @ts-ignore
    const discoveredDevices = prop('data', getDiscovery(state)) as RootState['application']['discovery']['data'];
    return {
        discoveredDevices: discoveredDevices,
    };
};

export default connect(_mapStateToProps)(Devices);
