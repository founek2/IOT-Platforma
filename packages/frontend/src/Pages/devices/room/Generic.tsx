import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
import type { BoxWidgetProps } from './components/BorderBox';
import boxHoc from './components/boxHoc';

const useStyles = makeStyles({
    header: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        height: '100%',
        cursor: 'pointer',
        justifyContent: 'center',
    },
});

function Generic({ deviceId, thing }: BoxWidgetProps) {
    const classes = useStyles();

    return (
        <>
            <Link to={{ search: `?thingId=${thing._id}&deviceId=${deviceId}` }}>
                <div className={classes.header}>
                    <Typography>{thing.config.name}</Typography>
                </div>
            </Link>
        </>
    );
}

export default boxHoc(Generic);
