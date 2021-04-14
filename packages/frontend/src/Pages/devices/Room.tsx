import { Grid, makeStyles } from "@material-ui/core";
import { IDevice } from "common/lib/models/interface/device";
import { ComponentType } from "common/lib/models/interface/thing";
import { errorLog } from "framework-ui/lib/logger";
import { LocationTypography } from "frontend/src/components/LocationTypography";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as deviceActions from "../../store/actions/application/devices";
import Activator from "./room/Activator";
import Generic from "./room/Generic";
import Sensor from "./room/Sensor";
import Switch from "./room/Swich";
import isAfk from "frontend/src/utils/isAfk";


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
                <Grid
                    item
                    xs={6}
                    md={3}
                    key={_id}
                >
                    <Comp
                        thing={thing}
                        onClick={(state: any) => updateState(device._id, thing.config.nodeId, state)}
                        lastChange={state?.timestamp}
                        disabled={isAfk(device.state?.status?.value)}
                        deviceStatus={device?.state?.status}
                        deviceId={device._id}
                        room={device.info.location.room}
                    />
                </Grid>
            );

            return createComponent();
        } else errorLog("Invalid component type:", config.componentType, "of device:", device.info.name);
        return null;
    });
}

interface RoomProps {
    devices: IDevice[];
    location: IDevice["info"]["location"];
    updateDeviceStateA: any;
}
function Room({ devices, updateDeviceStateA }: RoomProps) {
    const classes = useStyles();

    const location = devices[0].info.location;
    const boxes: (JSX.Element | null | void)[] = devices
        .map((device: IDevice) => generateBoxes(device, updateDeviceStateA, classes))
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
const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            updateDeviceStateA: deviceActions.updateState,
        },
        dispatch
    );

export default connect(undefined, _mapDispatchToProps)(Room);
