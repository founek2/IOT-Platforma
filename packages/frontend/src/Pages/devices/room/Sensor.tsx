import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from 'frontend/src/hooks';
import { RootState } from 'frontend/src/store/store';
import { head } from 'ramda';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SensorIcons } from '../../../components/SensorIcons';
import { getThingHistory } from '../../../utils/getters';
import type { BoxWidgetProps } from './components/BorderBox';
import boxHoc from './components/boxHoc';
import { SimpleDialog } from './components/Dialog';
import PropertyRow from './components/PropertyRow';

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
});

function Sensor({ onClick, deviceId, thing, room, fetchHistory }: BoxWidgetProps) {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = React.useState(false);
    const historyData = useAppSelector(getThingHistory);
    const property = head(thing.config.properties)!;
    const Icon = property.propertyClass ? SensorIcons[property.propertyClass] : null;
    const title = room + ' - ' + thing.config.name!;

    useEffect(() => {
        if (openDialog) fetchHistory();
    }, [openDialog, fetchHistory]);

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
                <div>
                    {thing.config.properties.map((property, i) => (
                        <PropertyRow
                            key={property.propertyId}
                            property={property}
                            value={thing.state?.value[property.propertyId]}
                            timestamp={thing.state?.timestamp && new Date(thing.state.timestamp)}
                            onChange={(newValue) => onClick({ [property.propertyId]: newValue })}
                            history={historyData?.deviceId === deviceId ? historyData : undefined}
                            defaultShowDetail={i === 0}
                        />
                    ))}
                </div>
            </SimpleDialog>
        </div>
    );
}

export default boxHoc(Sensor);
