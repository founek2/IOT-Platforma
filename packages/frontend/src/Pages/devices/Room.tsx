import { Grid, makeStyles } from '@material-ui/core';
import { IDevice } from 'common/lib/models/interface/device';
import { ComponentType } from 'common/lib/models/interface/thing';
import { errorLog } from 'framework-ui/lib/logger';
import { LocationTypography } from 'frontend/src/components/LocationTypography';
import React, { useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { devicesActions } from '../../store/actions/application/devices';
import Activator from './room/Activator';
import Generic from './room/Generic';
import Sensor from './room/Sensor';
import Switch from './room/Swich';
import isAfk from 'frontend/src/utils/isAfk';
import { DeviceContext } from 'frontend/src/hooks/useDevice';
import { ThingContext } from 'frontend/src/hooks/useThing';

const compMapper = {
    [ComponentType.switch]: Switch,
    [ComponentType.generic]: Generic,
    [ComponentType.sensor]: Sensor,
    [ComponentType.activator]: Activator,
};

const useStyles = makeStyles((theme) => ({
    root: {
        // padding: theme.spacing(2),
        // backgroundColor: grey[100],
    },
    location: {
        paddingBottom: 10,
    },
    // item: {
    //     height: "100%",
    // }
}));

function generateBoxes(device: IDevice, updateState: any, classes: any) {
    return device.things.map((thing) => {
        const { _id, config, state } = thing;
        const Comp = compMapper[config.componentType];

        if (Comp) {
            const createComponent = () => (
                <Grid item xs={6} md={3} key={_id}>
                    <DeviceContext.Provider value={{ _id: device._id, status: device.state?.status }}>
                        <ThingContext.Provider value={thing}>
                            <Comp
                                thing={thing}
                                onClick={(state: any) => updateState(device._id, thing.config.nodeId, state)}
                                lastChange={state?.timestamp}
                                disabled={isAfk(device.state?.status?.value)}
                                deviceStatus={device?.state?.status}
                                deviceId={device._id}
                                room={device.info.location.room}
                            />
                        </ThingContext.Provider>
                    </DeviceContext.Provider>
                </Grid>
            );

            return createComponent();
        } else errorLog('Invalid component type:', config.componentType, 'of device:', device.info.name);
        return null;
    });
}

interface RoomProps {
    devices: IDevice[];
    location: IDevice['info']['location'];
}
function Room({ devices }: RoomProps) {
    const classes = useStyles();
    const dispatch = useDispatch();

    function updateState(deviceId: any, thingId: string, state: any) {
        dispatch(devicesActions.updateState(deviceId, thingId, state));
    }

    const location = devices[0].info.location;
    const boxes: (JSX.Element | null | void)[] = devices
        .map((device: IDevice) => generateBoxes(device, updateState, classes))
        .flat(2);

    return (
        <div className={classes.root}>
            <LocationTypography location={location} className={classes.location} />
            <Grid container justify="center" spacing={2}>
                {boxes}
            </Grid>
        </div>
    );
}

export default Room;
