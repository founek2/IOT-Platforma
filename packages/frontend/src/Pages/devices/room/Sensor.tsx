import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import type { HistoricalSensor } from 'common/lib/models/interface/history';
import type { IThingProperty } from 'common/lib/models/interface/thing';
import UpdatedBefore from 'framework-ui/lib/Components/UpdatedBefore';
import ChartSimple from 'frontend/src/components/ChartSimple';
import { drop, head } from 'ramda';
import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SensorIcons } from '../../../components/SensorIcons';
import { getThingHistory } from '../../../utils/getters';
import type { BoxWidgetProps } from './components/BorderBox';
import boxHoc from './components/boxHoc';
import { SimpleDialog } from './components/Dialog';
import PropertyRow from './components/PropertyRow';
import { RootState } from 'frontend/src/store/store';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    header: {
        height: '1.7em',
        overflow: 'hidden',
        marginBottom: 15,
        cursor: 'pointer',
    },
    circle: {
        top: 3,
        right: 3,
        position: 'absolute',
    },
    container: {
        fontSize: 25,
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 5,
    },
    graph: {
        marginBottom: 25,
    },
    updatedBefore: {
        textAlign: 'center',
        marginBottom: 10,
    },
});

function Sensor({ onClick, deviceId, thing, room, fetchHistory }: BoxWidgetProps) {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = React.useState(false);
    const historyData = useSelector<RootState, RootState['application']['thingHistory']>(getThingHistory as any);
    const property = head(thing.config.properties)!;
    const Icon = property.propertyClass ? SensorIcons[property.propertyClass] : null;
    const title = room + ' - ' + thing.config.name!;

    useEffect(() => {
        if (openDialog) fetchHistory();
    }, [openDialog, fetchHistory]);
    const chartData = useMemo(
        () => [
            [{ type: 'date', label: 'Čas' }, title],
            ...mergeData(historyData.data as HistoricalSensor[], property.propertyId),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            historyData.data.length > 0 && historyData.data[0].first,
            historyData.data.length > 0 && historyData.data[historyData.data.length - 1].last,
            historyData.thingId === thing._id,
        ]
    );

    const value = thing.state?.value && thing.state.value[property.propertyId];

    return (
        <div className={classes.root}>
            <Typography className={classes.header} onClick={() => setOpenDialog(true)}>
                {thing.config.name}
            </Typography>

            <div className={classes.container}>
                {Icon ? <Icon className={classes.icon} /> : null}
                <Typography component="span">
                    {value || '??'}&nbsp;{property.unitOfMeasurement || ''}
                </Typography>
            </div>
            <SimpleDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title={title}
                deviceId={deviceId}
                thing={thing}
            >
                <div className={clsx(classes.container, classes.graph)}>
                    {Icon ? <Icon className={classes.icon} /> : null}
                    <Typography>
                        {room + ' ' + thing.config.name + ' ' + (value || '??')}&nbsp;{property.unitOfMeasurement || ''}
                    </Typography>
                </div>
                {thing.state?.timestamp ? (
                    <UpdatedBefore
                        time={new Date(thing.state.timestamp)}
                        variant="body2"
                        prefix="Aktualizováno před"
                        className={classes.updatedBefore}
                    />
                ) : null}
                {historyData.deviceId === deviceId && historyData.thingId === thing._id && chartData.length > 3 ? (
                    <ChartSimple data={chartData} />
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

function mergeData(data: HistoricalSensor[], propertyId: IThingProperty['propertyId']) {
    if (!propertyId) return [];

    let result: Array<[Date, number]> = [];
    data.forEach((doc) => {
        if (doc.properties[propertyId])
            result = result.concat(
                doc.properties[propertyId].samples.map((rec) => [new Date(rec.timestamp), rec.value])
            );
    });

    return result;
}

export default boxHoc(Sensor);
