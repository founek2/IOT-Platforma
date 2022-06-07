import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { IDevice } from 'common/lib/models/interface/device';
import { IDiscovery } from 'common/lib/models/interface/discovery';
import { Locations } from 'frontend/src/types';
import { prop } from 'ramda';
import React, { Fragment, useEffect, useMemo } from 'react';
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

const useStyles = makeStyles((theme) => ({
    cardContent: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

interface DevicesProps {
    devices: IDevice[];
    discoveredDevices: IDiscovery[];
    locations: Locations;
}

function Devices({}: DevicesProps) {
    const devices = useAppSelector(getDevices);
    const discoveredDevices = useAppSelector(getDiscovery);
    const locations = useAppSelector(locationsSelector);
    const classes = useStyles();
    const dispatch = useDispatch();
    useEffectFetchDevices();

    useEffect(() => {
        function addDiscoveredDevice(device: IDiscovery) {
            dispatch(discoveryActions.add(device));
        }

        io.getSocket().on('deviceDiscovered', addDiscoveredDevice);

        return () => {
            io.getSocket().off('deviceDiscovered', addDiscoveredDevice);
        };
    }, [dispatch]);

    useEffect(() => {
        dispatch(discoveryActions.fetch());

        const interval = setInterval(() => {
            dispatch(discoveryActions.fetch());
        }, 10 * 1000);

        return () => clearInterval(interval);
    }, [dispatch]);

    // Memoize because of discovery interval
    const devicesSectionMemo = useMemo(() => <DeviceSection devices={devices} />, [devices]);

    return (
        <Fragment>
            <Card>
                {/* <CardHeader title="Správa zařízení" /> */}
                <div className={classes.cardContent}>
                    <DiscoverySection discoveredDevices={discoveredDevices.data} locations={locations} />
                    {devicesSectionMemo}
                </div>
                <CardActions />
            </Card>
        </Fragment>
    );
}

export default Devices;
