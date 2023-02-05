import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { head } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';
import { SensorIcons } from '../../../components/SensorIcons';
import type { BoxWidgetProps } from './components/BorderBox';
import boxHoc from './components/boxHoc';

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
    container: {
        fontSize: 25,
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 5,
    },
});

function Sensor({ deviceId, thing }: BoxWidgetProps) {
    const classes = useStyles();
    const property = head(thing.config.properties)!;
    const Icon = property.propertyClass ? SensorIcons[property.propertyClass] : null;

    const value = thing.state?.[property.propertyId]?.value;

    return (
        <div className={classes.root}>
            <Link to={{ search: `?thingId=${thing._id}&deviceId=${deviceId}` }}>
                <Typography className={classes.header}>{thing.config.name}</Typography>
            </Link>
            <div className={classes.container}>
                {Icon ? <Icon className={classes.icon} /> : null}
                <Typography component="span">
                    {value === undefined ? '??' : value}&nbsp;{property.unitOfMeasurement || ''}
                </Typography>
            </div>
        </div>
    );
}

export default boxHoc(Sensor);
