import { Grid, makeStyles } from '@material-ui/core';
import { IDevice } from 'common/lib/models/interface/device';
import { ComponentType } from 'common/lib/models/interface/thing';
import { logger } from 'framework-ui/lib/logger';
import { LocationTypography } from 'frontend/src/components/LocationTypography';
import { DeviceContext } from 'frontend/src/hooks/useDevice';
import { ThingContext } from 'frontend/src/hooks/useThing';
import isAfk from 'frontend/src/utils/isAfk';
import React from 'react';
import { useDispatch } from 'react-redux';
import { devicesActions } from '../../store/actions/application/devices';
import Activator from './room/Activator';
import Generic from './room/Generic';
import Sensor from './room/Sensor';
import Switch from './room/Swich';

const compMapper = {
    [ComponentType.switch]: Switch,
    [ComponentType.generic]: Generic,
    [ComponentType.sensor]: Sensor,
    [ComponentType.activator]: Activator,
};

const useStyles = makeStyles((theme) => ({
    location: {
        paddingBottom: 10,
    },
    justifyWide: {
        [theme.breakpoints.up('md')]: {
            justifyContent: "center"
        },
    },
}));

function generateBoxes(device: IDevice, updateState: any, classes: any) {
    return device.things.map((thing) => {
        const { _id, config, state } = thing;
        const Comp = compMapper[config.componentType];

        if (Comp) {
            const createComponent = () => (
                <Grid item xs={6} md={3} key={_id}>
                    <DeviceContext.Provider value={{ _id: device._id, status: device.state?.status, metadata: device.metadata }}>
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
        } else logger.error('Invalid component type:', config.componentType, 'of device:', device.info.name);
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
        <div>
            <LocationTypography location={location} className={classes.location} />
            <Grid container className={classes.justifyWide} spacing={2}>
                {boxes}
            </Grid>
        </div>
    );
}

export default Room;
