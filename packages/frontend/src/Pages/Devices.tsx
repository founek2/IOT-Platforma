import { Grid, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { SocketUpdateThingState } from 'common/src/types';
import React, { Fragment, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { createSelector } from 'reselect';
import { useAppSelector } from 'src/hooks';
import { LocationTypography } from '../components/LocationTypography';
import { useEffectFetchDevices } from '../hooks/useEffectFetchDevices';
import { Device } from '../store/reducers/application/devices';
import { thingsReducerActions } from '../store/reducers/application/things';
import { RootState } from '../store/store';
import { getDevices } from '../utils/getters';
import io from '../webSocket';
import Room from './devices/Room';
import RoomWidget from './devices/RoomWidget';

const buildingsSelector = createSelector(getDevices, (devices) => {
    const buildings: Buildings = new Map();
    devices.forEach((device) => {
        const { building, room } = device.info.location;
        if (!buildings.has(building)) buildings.set(building, new Map());
        const roomMap = buildings.get(building)!;
        roomMap.set(room, [...(roomMap.get(room) || []), device]);
    });

    return buildings;
});

const useStyles = makeStyles((theme) => ({
    item: {
        width: 150,
        [theme.breakpoints.down('sm')]: {
            width: `calc(50% - ${theme.spacing(1.5)}px)`, // to add spacing to right
            margin: `${theme.spacing(1)}px 0 0 ${theme.spacing(1)}px`,
        },
    },
    widgetContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    widget: {
        height: '100%',
    },
    buildingContainer: {
        marginTop: theme.spacing(2),
    },
}));

function updateControl(updateThingA: any) {
    return ({ _id, thing }: SocketUpdateThingState) => {
        console.log('web socket GOT', _id, thing);
        thing.state!.timestamp = new Date();
        updateThingA({ _id, thing });
    };
}

type Buildings = Map<string, Map<string, Device[]>>;

export interface DeviceControlProps {
    selectedLocation: { building?: string; room?: string };
}
function Devices() {
    const params = useParams();
    const classes = useStyles();
    const buildings = useAppSelector(buildingsSelector);
    useEffectFetchDevices();
    const dispatch = useDispatch();
    useEffect(() => {
        function updateThingA(payload: SocketUpdateThingState) {
            dispatch(
                thingsReducerActions.updateOneState({
                    id: payload.thing._id,
                    changes: payload.thing.state,
                })
            );
        }

        const listener = updateControl(updateThingA);
        io.getSocket().on('control', listener);
        return () => io.getSocket().off('control', listener);
    }, [dispatch]);

    const selectedLocation = {
        building: params.building,
        room: params.room,
    };

    const selectedBuilding = selectedLocation.building ? buildings.get(selectedLocation.building) : null;
    const selectedRoom = selectedLocation.room ? selectedBuilding?.get(selectedLocation.room) : null;

    return (
        <Grid container justify="center">
            <Grid xs={12} md={10} lg={8} item>
                {!selectedRoom ? (
                    buildings.size === 0 ? (
                        <Typography>Nebyla nalezena žádná zařízení</Typography>
                    ) : (
                        <div className={classes.widgetContainer}>
                            {(selectedLocation.building && selectedBuilding
                                ? [[selectedLocation.building, selectedBuilding] as [string, Map<string, Device[]>]]
                                : [...buildings.entries()]
                            )
                                .sort(([name1], [name2]) => name1.localeCompare(name2))
                                .map(([building, rooms], idx) => {
                                    return (
                                        <Fragment key={building}>
                                            <LocationTypography
                                                location={{ building }}
                                                linkBuilding={Boolean(!selectedBuilding)}
                                                className={clsx(idx > 0 && classes.buildingContainer)}
                                            />
                                            <Grid container spacing={2}>
                                                {[...rooms.entries()]
                                                    .sort(([name1], [name2]) => name1.localeCompare(name2))
                                                    .map(([room, devices]) => (
                                                        <Grid item xs={12} md={6} lg={6} key={building + '/' + room}>
                                                            <Link to={`/devices/${building}/${room}`}>
                                                                <RoomWidget
                                                                    devices={devices}
                                                                    className={classes.widget}
                                                                />
                                                            </Link>
                                                        </Grid>
                                                    ))}
                                            </Grid>
                                        </Fragment>
                                    );
                                })}
                        </div>
                    )
                ) : (
                    <Room location={selectedLocation as { building: string; room: string }} devices={selectedRoom} />
                )}
            </Grid>
        </Grid>
    );
}

const _mapStateToProps = (state: RootState, { match }: { match: { params: { building?: string; room?: string } } }) => {
    return {
        selectedLocation: {
            building: match.params.building,
            room: match.params.room,
        },
    };
};

export default Devices;
