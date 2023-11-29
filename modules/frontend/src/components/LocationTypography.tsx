import Breadcrumbs from '@mui/material/Breadcrumbs';
import LinkMUI from '@mui/material/Link';
import React from 'react';
import { Link } from 'react-router-dom';

interface LocationTypographyProps {
    location: {
        building: string;
        room?: string;
    };
    pathPrefix?: string;
}

export function LocationTypography({ location, pathPrefix }: LocationTypographyProps) {
    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: 24,
            }}
        >
            <Link to={`${pathPrefix || ''}/building`}>
                <LinkMUI underline="hover" color="inherit" component="span">
                    {location.building}
                </LinkMUI>
            </Link>
            {location.room ? (
                <LinkMUI underline="none" color="inherit">
                    {location.room}
                </LinkMUI>
            ) : null}
        </Breadcrumbs>
    );
}
