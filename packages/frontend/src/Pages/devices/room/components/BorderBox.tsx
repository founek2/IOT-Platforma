import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { DeviceStatus, IDevice, IDeviceStatus } from 'common/lib/models/interface/device';
import { IThing, IThingProperty } from 'common/lib/models/interface/thing';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OnlineCircle from '../../../../components/OnlineCircle';
import { devicesActions } from '../../../../store/actions/application/devices';
import * as thingHistoryActions from '../../../../store/actions/application/thingHistory';

const useStyles = makeStyles({
    circle: {
        top: 3,
        right: 3,
        position: 'absolute',
    },
    contextMenu: {
        width: '20%',
        height: '20%',
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    box: {
        backgroundColor: 'white',
        // border: "1px solid rgb(189, 189, 189)",
        // borderRadius: 10,
        padding: '1rem',
        boxSizing: 'border-box',
        height: '100%',
        position: 'relative',
    },
});

// const defaultProps = {
//     bgcolor: "background.paper",
//     // m: 1,
//     border: 1,
//     style: { padding: "1rem" },
//     position: "relative",
//     width: "100%",
//     boxSizing: "border-box"
// };

export interface BoxWidgetProps {
    className?: string;
    thing: IThing;
    onClick: (newState: any) => Promise<void>;
    deviceStatus: IDeviceStatus;
    deviceId: IDevice['_id'];
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
    deviceId: IDevice['_id'];
    room: string;
    property?: IThingProperty;
    disabled?: boolean;
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
    const ref: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);

    useEffect(() => {
        clear(ref);
        return () => clear(ref);
    }, [lastChange]);

    async function handleClick(newState: any) {
        await onClick(newState);
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
        }, 3000);
    }

    const Component = component;
    return (
        <Paper
            // display="inline-block"
            // borderRadius={10}
            // borderColor="grey.400"
            // className={className ? className : ""}
            // {...defaultProps}
            elevation={2}
            className={classes.box}
        >
            {deviceStatus?.value &&
                deviceStatus?.value !== DeviceStatus.ready &&
                deviceStatus?.value !== DeviceStatus.sleeping && (
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
            {/* <div onContextMenu={handleContext} className={classes.contextMenu}></div> */}
            {/* <ControlDetail
				open={detailOpen}
				data={data}
				handleClose={() => setOpen(false)}
			/> */}
        </Paper>
    );
}
const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            updateDeviceAction: devicesActions.update,
            fetchThingHistory: thingHistoryActions.fetchHistory,
        },
        dispatch
    );

export default connect(null, _mapDispatchToProps)(BorderBox);
