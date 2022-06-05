import { Grid } from '@material-ui/core';
import { ComponentType } from 'common/lib/models/interface/thing';
import { logger } from 'framework-ui/lib/logger';
import { useAppDispatch, useAppSelector } from 'frontend/src/hooks';
import { DeviceContext } from 'frontend/src/hooks/useDevice';
import { ThingContext } from 'frontend/src/hooks/useThing';
import { Device } from 'frontend/src/store/reducers/application/devices';
import { Thing } from 'frontend/src/store/reducers/application/things';
import { getThing } from 'frontend/src/utils/getters';
import isAfk from 'frontend/src/utils/isAfk';
import React from 'react';
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

interface RoomBoxProps {
    device: Device;
    thingId: Thing['_id'];
}
function RoomBox({ device, thingId }: RoomBoxProps) {
    const thing = useAppSelector(getThing(thingId))!;
    const { _id, config, state } = thing;
    const dispatch = useAppDispatch();
    const Comp = compMapper[config.componentType];
    if (!Comp) {
        logger.error('Invalid component type:', config.componentType, 'of device:', device.info.name);
        return null;
    }

    return (
        <Grid item xs={6} md={3} key={_id}>
            <DeviceContext.Provider
                value={{ _id: device._id, status: device.state?.status, metadata: device.metadata }}
            >
                <ThingContext.Provider value={thing}>
                    <Comp
                        thing={thing}
                        onClick={(state: any) => dispatch(devicesActions.updateState(device._id, thing._id, state))}
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
}

export default RoomBox;
