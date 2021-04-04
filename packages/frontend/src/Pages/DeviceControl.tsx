import { Grid, makeStyles, Typography } from "@material-ui/core";
import { IDevice } from "common/lib/models/interface/device";
import { SocketUpdateThingState } from "common/lib/types";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import { getUserPresence, isUrlHash } from "framework-ui/lib/utils/getters";
import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { createSelector } from "reselect";
import { LocationTypography } from "../components/LocationTypography";
import * as deviceActions from "../store/actions/application/devices";
import * as controlActions from "../store/actions/application/devices/control";
import { getDevicesLastUpdate, getQueryField } from "../utils/getters";
import io from "../webSocket";
import Room from "./deviceControl/Room";
import RoomWidget from "./deviceControl/RoomWidget";

function isControllable(device: IDevice) {
    return Boolean(device.permissions && device.permissions.control);
}

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
    // widget: {
    //     flex: "1 0 44%",
    //     // margin: 10,
    // },
}));

function updateDevice(updateThingA: any) {
    return ({ _id, thing }: SocketUpdateThingState) => {
        console.log("web socket GOT", _id, thing);
        thing.state!.timestamp = new Date();
        updateThingA({ _id, thing });
    };
}

type Buildings = Map<string, Map<string, IDevice[]>>;

interface DeviceControlProps {
    fetchDevicesAction: any;
    updateDeviceAction: any;
    devicesLastUpdate: any;
    updateThingA: any;
    buildings: Buildings;
    selectedLocation: IDevice["info"]["location"];
}
function DeviceControl({
    fetchDevicesAction,
    updateDeviceAction,
    updateThingA,
    devicesLastUpdate,
    buildings,
    selectedLocation,
}: DeviceControlProps) {
    const classes = useStyles();
    useEffect(() => {
        fetchDevicesAction();

        const listener = updateDevice(updateThingA);
        io.getSocket().on("control", listener);
        io.getSocket().on("device", updateDeviceAction);

        const listenerAck = updateDevice(updateDeviceAction);
        io.getSocket().on("ack", listenerAck);

        return () => {
            io.getSocket().off("control", listener);
            io.getSocket().off("ack", listenerAck);
            io.getSocket().off("device", updateDeviceAction);
        };
    }, [fetchDevicesAction, updateDeviceAction, updateThingA]);

    useEffect(() => {
        const listenConnect = () => {
            console.log("connect");
            // window.removeEventListener("focus", handler);
        };
        const listenDisconnect = () => {
            console.log("disconnected");
            // window.addEventListener("focus", handler);
        };

        io.getSocket().on("disconnect", listenDisconnect);
        io.getSocket().on("connect", listenConnect);

        return () => {
            io.getSocket().off("disconnect", listenDisconnect);
            io.getSocket().off("connect", listenConnect);
        };
    }, [devicesLastUpdate]);

    const selectedBuilding = buildings.get(selectedLocation.building);
    const selectedRoom = selectedBuilding?.get(selectedLocation.room);

    return (
        <div className={classes.root}>
            <Grid container justify="center">
                <Grid md={8} xs={12} item>
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
                                                        <Grid item xs={12} md={6} lg={6}>
                                                            <Link
                                                                to={{
                                                                    search: `?building=${building}&room=${room}`,
                                                                }}
                                                                // className={classes.widget}
                                                                key={building + "/" + room}
                                                            >
                                                                <RoomWidget devices={devices} />
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
                            <Room location={selectedLocation} devices={selectedRoom} />
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

const _mapStateToProps = (state: any) => {
    const JSONkey = getQueryField("JSONkey", state);

    return {
        buildings: buildingsSelector(state),
        // buildings,
        openNotifyDialog: isUrlHash("#editNotify")(state),
        isUserPresent: getUserPresence(state),
        devicesLastUpdate: getDevicesLastUpdate(state),
        JSONkey,
        selectedLocation: {
            building: getQueryField("building", state),
            room: getQueryField("room", state),
        },
    };
};

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            fetchDevicesAction: deviceActions.fetch,
            updateDeviceStateA: deviceActions.updateState,
            updateThingA: deviceActions.updateThing,
            updateDeviceAction: deviceActions.update,
            resetEditNotifyControlA: formsActions.removeForm("EDIT_NOTIFY_SENSORS"),
            updateNotifyControlA: controlActions.updateNotify,
            prefillNotifyControlA: controlActions.prefillNotify,
        },
        dispatch
    );

export default connect(_mapStateToProps, _mapDispatchToProps)(DeviceControl);
