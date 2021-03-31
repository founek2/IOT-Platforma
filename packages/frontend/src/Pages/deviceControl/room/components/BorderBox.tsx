import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import OnlineCircle from "../../../../components/OnlineCircle";
import isAfk from "../../../../utils/isAfk";
import forceUpdateHoc from "framework-ui/lib/Components/forceUpdateHoc";
import ControlDetail from "./borderBox/ControlDetail";
import Loader from "framework-ui/lib/Components/Loader";
import { IThing, IThingProperty } from "common/lib/models/interface/thing";
import { IDevice, DeviceStatus, IDeviceStatus } from "common/lib/models/interface/device";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as deviceActions from "../../../../store/actions/application/devices";
import * as thingHistoryActions from "../../../../store/actions/application/thingHistory";

const useStyles = makeStyles({
    circle: {
        top: 3,
        right: 3,
        position: "absolute",
    },
    contextMenu: {
        width: "20%",
        height: "20%",
        position: "absolute",
        right: 0,
        bottom: 0,
    },
});

const defaultProps = {
    bgcolor: "background.paper",
    m: 1,
    border: 1,
    style: { padding: "1rem" },
    position: "relative",
};

export interface BoxWidgetProps {
    className?: string;
    thing: IThing;
    onClick: (newState: any) => Promise<void>;
    deviceStatus: IDeviceStatus;
    deviceId: IDevice["_id"];
    disabled?: boolean;
    fetchHistory: () => Promise<void>;
    room: string;
    property?: IThingProperty;
}
export interface GeneralBoxProps {
    lastChange?: Date;
    className?: string;
    thing: IThing;
    onClick: (newState: any) => Promise<void>;
    deviceStatus: IDeviceStatus;
    deviceId: IDevice["_id"];
    room: string;
    property?: IThingProperty;
}

export interface BorderBoxProps extends GeneralBoxProps {
    component: FunctionComponent<BoxWidgetProps>;
    fetchThingHistory: any;
    updateDeviceAction: any;
}

function clear(ref: React.MutableRefObject<NodeJS.Timeout | null>) {
    if (ref.current) {
        clearTimeout(ref.current);
        ref.current = null;
    }
}
function BorderBox({
    className,
    onClick,
    component,
    deviceStatus,
    deviceId,
    updateDeviceAction,
    lastChange,
    fetchThingHistory,
    thing,
    ...other
}: BorderBoxProps) {
    const classes = useStyles();
    const [detailOpen, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const ref: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);

    useEffect(() => {
        clear(ref);
        return () => clear(ref);
    }, [lastChange]);

    async function handleClick(newState: any) {
        setPending(true);
        await onClick(newState);
        setPending(false);
        ref.current = setTimeout(() => {
            updateDeviceAction({
                _id: deviceId,
                state: {
                    status: {
                        value: DeviceStatus.alert,
                        timestamp: new Date(),
                    },
                },
            });
        }, 2000);
    }

    function handleContext(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        setOpen(true);
    }

    const afk = deviceStatus && isAfk(deviceStatus.value);
    const Component = component;
    return (
        <Box
            display="inline-block"
            borderRadius={10}
            borderColor="grey.400"
            className={className ? className : ""}
            {...defaultProps}
        >
            {deviceStatus?.value && deviceStatus?.value !== DeviceStatus.ready && deviceStatus?.value !== DeviceStatus.sleeping && (
                <OnlineCircle inTransition={false} className={classes.circle} status={deviceStatus} />
            )}
            <Component
                onClick={handleClick}
                // lastChange={lastChange}
                deviceStatus={deviceStatus}
                thing={thing}
                deviceId={deviceId}
                fetchHistory={() => fetchThingHistory(deviceId, thing._id)}
                {...other}
            />
            {/* <Loader open={pending} className="marginAuto" /> */}
            <div onContextMenu={handleContext} className={classes.contextMenu}></div>
            {/* <ControlDetail
				open={detailOpen}
				data={data}
				handleClose={() => setOpen(false)}
			/> */}
        </Box>
    );
}
const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            updateDeviceAction: deviceActions.update,
            fetchThingHistory: thingHistoryActions.fetchHistory,
        },
        dispatch
    );

export default connect(null, _mapDispatchToProps)(BorderBox);
