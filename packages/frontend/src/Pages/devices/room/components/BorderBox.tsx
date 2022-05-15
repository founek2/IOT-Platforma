import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { DeviceStatus, IDevice, IDeviceStatus } from 'common/lib/models/interface/device';
import { IThing, IThingProperty } from 'common/lib/models/interface/thing';
import React, { FunctionComponent, useEffect, useRef, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OnlineCircle from '../../../../components/OnlineCircle';
import { devicesActions } from '../../../../store/actions/application/devices';
import { thingHistoryActions } from '../../../../store/actions/application/thingHistory';
import { useAppDispatch } from 'frontend/src/hooks';

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
        padding: '1rem',
        boxSizing: 'border-box',
        height: '100%',
        position: 'relative',
    },
});

export interface BoxWidgetProps {
    className?: string;
    thing: IThing;
    onClick: (newState: any) => Promise<void>;
    deviceStatus: IDeviceStatus;
    deviceId: IDevice['_id'];
    disabled?: boolean;
    fetchHistory: () => Promise<any>;
    room: string;
    property?: IThingProperty;
}
export interface GeneralBoxProps {
    lastChange?: Date;
    className?: string;
    thing: IThing;
    onClick: (newState: any) => Promise<any>;
    deviceStatus: IDeviceStatus;
    deviceId: IDevice['_id'];
    room: string;
    property?: IThingProperty;
    disabled?: boolean;
}

export interface BorderBoxProps extends GeneralBoxProps {
    component: FunctionComponent<BoxWidgetProps>;
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
    lastChange,
    thing,
    ...other
}: BorderBoxProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const [inTransition, setInTransition] = useState(false);
    const ref: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);
    const fetchHistory = useCallback(
        () => dispatch(thingHistoryActions.fetchHistory(deviceId, thing._id)),
        [deviceId, thing._id]
    );

    useEffect(() => {
        if (inTransition) {
            clear(ref);
            setInTransition(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastChange, setInTransition]);

    async function handleClick(newState: any) {
        setInTransition(true);
        await onClick(newState);
        ref.current = setTimeout(() => {
            dispatch(
                devicesActions.updateOne({
                    id: deviceId,
                    changes: {
                        state: {
                            status: {
                                value: DeviceStatus.alert,
                                timestamp: new Date(),
                            },
                        },
                    },
                })
            );
        }, 3000);
    }

    const Component = component;
    return (
        <Paper elevation={2} className={classes.box}>
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
                fetchHistory={fetchHistory}
                {...other}
            />
        </Paper>
    );
}

export default BorderBox;
