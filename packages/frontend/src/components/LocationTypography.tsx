import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    buildingTitle: {
        flex: '1 0 100%',
        textAlign: 'center',
        [theme.breakpoints.down('sm')]: {
            textAlign: 'left',
        },
        color: grey[700],
    },
}));

interface LocationTypographyProps {
    location: {
        building: string;
        room?: string;
    };
    linkBuilding?: boolean;
    className?: string;
}

export function LocationTypography({ location, linkBuilding, className }: LocationTypographyProps) {
    const classes = useStyles();
    const linkToRoot = <Link to="/devices">/</Link>;
    const linkToBuilding = <Link to={`/devices/${location.building}`}>{location?.building}</Link>;

    return (
        <Typography className={clsx(classes.buildingTitle, className)} variant="h4">
            {!linkBuilding && linkToRoot}
            {linkToBuilding}

            {!linkBuilding && location.room && '/'}
            <wbr />
            {location.room}
        </Typography>
    );
}
