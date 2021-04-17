import { Grid, makeStyles, Typography } from "@material-ui/core";
import { IDevice } from "common/lib/models/interface/device";
import { SocketUpdateThingState } from "common/lib/types";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import { getUserPresence, isUrlHash, getApplication } from "framework-ui/lib/utils/getters";
import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { createSelector } from "reselect";
import { LocationTypography } from "../components/LocationTypography";
import * as deviceActions from "../store/actions/application/devices";
import { getDevicesLastUpdate, getQueryField } from "../utils/getters";
import io from "../webSocket";
import Room from "./devices/Room";
import RoomWidget from "./devices/RoomWidget";
import { path } from "ramda";
import { IState } from "../types";
import { useEffectFetchDevices } from "../hooks/useEffectFetchDevices";


const useStyles = makeStyles((theme) => ({
    root: {
        // display: "flex",
        // flexWrap: "wrap",
        padding: theme.spacing(2),
    },
    item: {
        width: 150,
        [theme.breakpoints.down("sm")]: {
            width: `calc(50% - ${theme.spacing(1.5)}px)`, // to add spacing to right
            margin: `${theme.spacing(1)}px 0 0 ${theme.spacing(1)}px`,
        },
    },
    widgetContainer: {
        display: "flex",
        flexWrap: "wrap",
    },
    widget: {
        height: "100%"
    },
}));

function updateControl(updateThingA: any) {
    return ({ _id, thing }: SocketUpdateThingState) => {
        console.log("web socket GOT", _id, thing);
        thing.state!.timestamp = new Date();
        updateThingA({ _id, thing });
    };
}

type Buildings = Map<string, Map<string, IDevice[]>>;

interface DeviceControlProps {
    buildings: Buildings;
    selectedLocation: { building?: string, room?: string };
    updateThingA: any,
}
function Devices({
    buildings,
    selectedLocation,
    updateThingA,
}: DeviceControlProps) {
    const classes = useStyles();
    useEffectFetchDevices();
    useEffect(() => {
        const listener = updateControl(updateThingA);
        io.getSocket().on("control", listener);
        return () => io.getSocket().off("control", listener);
    }, [updateThingA])

    const selectedBuilding = selectedLocation.building ? buildings.get(selectedLocation.building) : null;
    const selectedRoom = selectedLocation.room ? selectedBuilding?.get(selectedLocation.room) : null;

    return (
        <div className={classes.root}>

            <Grid container justify="center">
                <Grid xs={12} md={10} lg={8} item>
                    {!selectedRoom ? (
                        buildings.size === 0 ? (
                            <Typography>Nebyla nalezena žádná zařízení</Typography>
                        ) : (
                                <div className={classes.widgetContainer}>
                                    {(selectedBuilding
                                        ? ([[selectedLocation.building, selectedBuilding]] as Array<
                                            [string, Map<string, IDevice[]>]
                                        >)
                                        : [...buildings.entries()]
                                    ).map(([building, rooms]) => {
                                        return (
                                            <Fragment key={building}>
                                                <LocationTypography
                                                    location={{ building }}
                                                    linkBuilding={Boolean(!selectedBuilding)}
                                                />
                                                <Grid container spacing={2}>
                                                    {[...rooms.entries()].map(([room, devices]) => (
                                                        <Grid item xs={12} md={6} lg={6} key={building + "/" + room}>
                                                            <Link
                                                                to={`/devices/${building}/${room}`}
                                                            >
                                                                <RoomWidget devices={devices} className={classes.widget} />
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
                            <Room
                                location={selectedLocation as { building: string, room: string }}
                                devices={selectedRoom}
                            />
                        )}
                </Grid>
            </Grid>
        </div >
    );
}

const buildingsSelector = createSelector<any, { data: IDevice[]; lastUpdate: Date }, Buildings>(
    // (o(filter(isControllable), getDevices) as unknown) as any,
    (state: any) => state.application.devices,
    ({ data: devices, lastUpdate }: { data: IDevice[]; lastUpdate: Date }) => {
        const buildings = new Map<string, Map<string, IDevice[]>>();
        devices.forEach((device) => {
            const { building, room } = device.info.location;
            if (!buildings.has(building)) buildings.set(building, new Map());
            const roomMap = buildings.get(building)!;
            roomMap.set(room, [...(roomMap.get(room) || []), device]);
        });

        return buildings;
    }
);

const _mapStateToProps = (state: IState, { match }: { match: { params: { building?: string, room?: string } } }) => {
    return {
        buildings: buildingsSelector(state),
        selectedLocation: {
            building: match.params.building,
            room: match.params.room,
        },
    };
};

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            updateThingA: deviceActions.updateThing,
        },
        dispatch
    );



export default connect(_mapStateToProps, _mapDispatchToProps)(Devices);
