import { Grid, makeStyles } from '@material-ui/core';
import { LocationTypography } from 'frontend/src/components/LocationTypography';
import { Device } from 'frontend/src/store/reducers/application/devices';
import React from 'react';
import RoomBox from './RoomBox';

const useStyles = makeStyles((theme) => ({
    location: {
        paddingBottom: 10,
    },
    justifyWide: {
        [theme.breakpoints.up('md')]: {
            justifyContent: "center"
        },
    },
}));

interface RoomProps {
    devices: Device[];
    location: Device['info']['location'];
}
function Room({ devices }: RoomProps) {
    const classes = useStyles();

    const location = devices[0].info.location;

    return (
        <div>
            <LocationTypography location={location} className={classes.location} />
            <Grid container className={classes.justifyWide} spacing={2}>
                {devices
                    .map((device) => device.things.map(thingId => <RoomBox key={thingId} device={device} thingId={thingId} />))
                    .flat(2)}
            </Grid>
        </div>
    );
}

export default Room;
