import { Grid, makeStyles } from '@material-ui/core';
import { Dictionary } from '@reduxjs/toolkit';
import { ComponentType } from 'common/lib/models/interface/thing';
import { logger } from 'framework-ui/lib/logger';
import { LocationTypography } from 'frontend/src/components/LocationTypography';
import { useAppSelector } from 'frontend/src/hooks';
import { DeviceContext } from 'frontend/src/hooks/useDevice';
import { ThingContext } from 'frontend/src/hooks/useThing';
import { Device } from 'frontend/src/store/reducers/application/devices';
import { Thing } from 'frontend/src/store/reducers/application/things';
import { getThingEntities } from 'frontend/src/utils/getters';
import isAfk from 'frontend/src/utils/isAfk';
import React from 'react';
import { useDispatch } from 'react-redux';
import { devicesActions } from '../../store/actions/application/devices';
import Activator from './room/Activator';
import Generic from './room/Generic';
import Sensor from './room/Sensor';
import Switch from './room/Swich';
import RoomBox from './RoomBox';

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


function generateBoxes(device: Device, thingEntities: Dictionary<Thing>, updateState: any, classes: any) {
    return device.things.map((thingId) => {
        const thing = thingEntities[thingId]!
        const { _id, config, state } = thing;
        const Comp = compMapper[config.componentType];

        if (Comp) {
            const createComponent = () => (
                <Grid item xs={6} md={3} key={_id}>
                    <DeviceContext.Provider value={{ _id: device._id, status: device.state?.status, metadata: device.metadata }}>
                        <ThingContext.Provider value={thing}>
                            <Comp
                                thing={thing}
                                onClick={(state: any) => updateState(device._id, thing._id, state)}
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
    devices: Device[];
    location: Device['info']['location'];
}
function Room({ devices }: RoomProps) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const thingEntities = useAppSelector(getThingEntities)
    function updateState(deviceId: Device["_id"], thingId: Thing["_id"], state: Thing["state"]) {
        dispatch(devicesActions.updateState(deviceId, thingId, state));
    }

    const location = devices[0].info.location;
    const boxes: (JSX.Element | null | void)[] = devices
        .map((device) => generateBoxes(device, thingEntities, updateState, classes))
        .flat(2);

    return (
        <div>
            <LocationTypography location={location} className={classes.location} />
            <Grid container className={classes.justifyWide} spacing={2}>
                {devices
                    .map((device) => device.things.map(thingId => <RoomBox key={thingId} device={device} thingId={thingId} />))
                    .flat(2)}
            </Grid>
        </div>
    );
}

export default Room;
