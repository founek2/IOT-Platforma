import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { IDevice } from "common/lib/models/interface/device";
import { IDiscovery } from "common/lib/models/interface/discovery";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import { isUrlHash, getApplication } from "framework-ui/lib/utils/getters";
import { equals, filter, o, prop, path } from "ramda";
import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as deviceActions from "../store/actions/application/devices";
import * as discoveredActions from "../store/actions/application/discovery";
import { IState } from "../types";
import { getDevices, getDiscovery, getQueryField, getQueryID } from "../utils/getters";
import io from "../webSocket";
import DeviceSection from "./deviceManagement/DeviceSection";
import DiscoverySection from "./deviceManagement/DiscoverySection";

function isWritable(device: IDevice) {
    return device.permissions && device.permissions.write && Boolean(~device.permissions.write.length);
}

interface DevicesProps {
    history: any;
    devices: IDevice[];
    discoveredDevices: IDiscovery[];
    updateDeviceAction: any;
    addDiscoveredDeviceAction: any;
    fetchDevicesAction: any;
    fetchDiscoveredDevicesAction: any;
    devicesLastFetch?: Date;
}


function Devices({ devices, discoveredDevices, updateDeviceAction, addDiscoveredDeviceAction, fetchDiscoveredDevicesAction, fetchDevicesAction, devicesLastFetch }: DevicesProps) {
    useEffect(() => {
        fetchDevicesAction();
        fetchDiscoveredDevicesAction();

        io.getSocket().on("device", updateDeviceAction);
        io.getSocket().on("deviceDiscovered", addDiscoveredDeviceAction);

        return () => {
            io.getSocket().off("device", updateDeviceAction);
            io.getSocket().off("deviceDiscovered", addDiscoveredDeviceAction);
        };
    }, [updateDeviceAction, addDiscoveredDeviceAction, fetchDevicesAction, fetchDiscoveredDevicesAction]);

    useEffect(() => {
        function handler() {
            console.log("focus")
            const isOld = !devicesLastFetch || Date.now() - new Date(devicesLastFetch).getTime() > 20 * 60 * 1000
            if (!io.getSocket().isConnected() || isOld) {
                fetchDevicesAction()
                console.log("downloading devices")
            }
        }
        window.addEventListener("focus", handler)

        return () => window.removeEventListener("focus", handler)
    }, [fetchDevicesAction, devicesLastFetch])

    return (
        <Fragment>
            <Card>
                <CardHeader title="Správa zařízení" />
                <CardContent>
                    <DiscoverySection discoveredDevices={discoveredDevices} />
                    <DeviceSection devices={devices} />
                </CardContent>
                <CardActions />
            </Card>
        </Fragment>
    );
}

const _mapStateToProps = (state: IState) => {
    const deviceId = getQueryField("deviceId")(state);
    // @ts-ignore
    const discoveredDevices = prop("data", getDiscovery(state)) as IState["application"]["discovery"]["data"];
    // @ts-ignore
    const toAddDevice = discoveredDevices.find(o(equals(deviceId), prop("deviceId")));
    const devices = getDevices(state);
    return {
        devices,
        devicesLastFetch: path(["devices", "lastFetch"], getApplication(state)) as IState["application"]["devices"]["lastFetch"],
        discoveredDevices: discoveredDevices,
        toAddDevice,
    };
};

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            fetchDevicesAction: deviceActions.fetch,
            fetchDiscoveredDevicesAction: discoveredActions.fetch,
            updateDeviceAction: deviceActions.update,
            addDiscoveredDeviceAction: discoveredActions.add,
        },
        dispatch
    );

export default connect(_mapStateToProps, _mapDispatchToProps)(Devices);
