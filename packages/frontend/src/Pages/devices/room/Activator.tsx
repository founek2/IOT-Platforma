import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import clsx from 'clsx';
import { IThingPropertyEnum, IThingProperty } from 'common/lib/models/interface/thing';
import { drop, head } from 'ramda';
import React, { useEffect } from 'react';
import type { BoxWidgetProps } from './components/BorderBox';
import boxHoc from './components/boxHoc';
import { SimpleDialog } from './components/Dialog';
import PropertyRow from './components/PropertyRow';
import { CopyUrlContext } from './components/helpers/CopyUrl';
import { useSelector } from 'react-redux';
import { RootState } from 'frontend/src/store/store';
import { getThingHistory } from 'frontend/src/utils/getters';
import { useMemo } from 'react';
import { HistoricalSensor, HistoricalGeneric } from 'common/lib/models/interface/history';
import ChartSimple from 'frontend/src/components/ChartSimple';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        paddingBottom: '0.4em',
        overflow: 'hidden',
        textAlign: 'center',
        cursor: 'pointer',
    },
    switchContainer: {
        // margin: "0 auto",
        cursor: 'pointer',
        display: 'inline-box',
    },
    verticalAlign: {
        display: 'flex',
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    button: {
        padding: '6px 18px 6px 18px',
    },
    select: {
        paddingLeft: 5,
    },
}));

function Activator({ onClick, deviceId, thing, className, room, fetchHistory, disabled }: BoxWidgetProps) {
    const classes = useStyles();
    const property = head(thing.config.properties)! as IThingPropertyEnum;
    const value = (thing.state?.value || { [property.propertyId]: 'false' })[property.propertyId];
    const historyData = useSelector<RootState, RootState['application']['thingHistory']>(getThingHistory as any);
    const [openDialog, setOpenDialog] = React.useState(false);
    const title = room + ' - ' + thing.config.name!;

    useEffect(() => {
        if (openDialog) fetchHistory();
    }, [openDialog]);

    const chartData = useMemo(
        () => [
            [{ type: 'date', label: 'Čas' }, title],
            ...mergeData(historyData.data as unknown as HistoricalGeneric[], property.propertyId),
        ],
        [
            historyData.data.length > 0 && historyData.data[0].first,
            historyData.data.length > 0 && historyData.data[historyData.data.length - 1].last,
            historyData.thingId === thing._id,
        ]
    );

    console.log(
        'chartData',
        chartData.map(([a, b]) => typeof a)
    );

    return (
        <div className={clsx(className, classes.root)}>
            <div className={classes.header} onClick={() => setOpenDialog(true)}>
                <Typography component="span">{thing.config.name}</Typography>
            </div>
            <div className={classes.verticalAlign}>
                {property.format.length === 1 ? (
                    <div className={classes.switchContainer}>
                        <CopyUrlContext propertyId={property.propertyId} value={head(property.format) as string}>
                            <IconButton
                                aria-label="delete"
                                className={classes.button}
                                disabled={disabled}
                                onClick={() =>
                                    onClick({
                                        [property.propertyId]: head(property.format),
                                    })
                                }
                            >
                                <PowerSettingsNewIcon fontSize="large" />
                            </IconButton>
                        </CopyUrlContext>
                    </div>
                ) : (
                    <CopyUrlContext propertyId={property.propertyId} value={value as string}>
                        <Select
                            className={classes.select}
                            value={value}
                            disabled={disabled}
                            onChange={(e) => {
                                onClick({ [property.propertyId]: e.target.value as string });
                            }}
                            disableUnderline
                        >
                            {property.format.map((label) => (
                                <MenuItem value={label} key={label}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </CopyUrlContext>
                )}
            </div>

            <SimpleDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title={thing.config.name}
                deviceId={deviceId}
                thing={thing}
            >
                {historyData.deviceId === deviceId && historyData.thingId === thing._id && chartData.length > 2 ? (
                    <ChartSimple data={chartData} type="ScatterChart" />
                ) : null}
                <div>
                    {drop(1, thing.config.properties).map((property) => (
                        <PropertyRow
                            key={property.propertyId}
                            property={property}
                            value={thing.state?.value[property.propertyId]}
                            onChange={(newValue) => onClick({ [property.propertyId]: newValue })}
                        />
                    ))}
                </div>
            </SimpleDialog>
        </div>
    );
}

function mergeData(data: HistoricalGeneric[], propertyId: IThingProperty['propertyId']) {
    if (!propertyId) return [];

    let result: Array<[Date, number]> = [];
    data.forEach((doc) => {
        if (doc.properties[propertyId])
            result = result.concat(
                doc.properties[propertyId].samples.map((rec) => [new Date(rec.timestamp), rec.value === 'on' ? 1 : 0])
            );
    });

    return result;
}

export default boxHoc(Activator);
