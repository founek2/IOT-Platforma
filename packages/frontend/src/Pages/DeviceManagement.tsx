import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import React, { Fragment, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import { useEffectFetchDevices } from '../hooks/useEffectFetchDevices';
import { discoveryActions } from '../store/actions/application/discovery';
import { Discovery } from '../store/reducers/application/discovery';
import { locationsSelector } from '../store/selectors/deviceSelector';
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

function Devices() {
    const devices = useAppSelector(getDevices);
    const discoveredDevices = useAppSelector(getDiscovery);
    const locations = useAppSelector(locationsSelector);
    const classes = useStyles();
    const dispatch = useDispatch();
    useEffectFetchDevices();
    // TODO fetch periodically discovery

    useEffect(() => {
        function addDiscoveredDevice(device: Discovery) {
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
