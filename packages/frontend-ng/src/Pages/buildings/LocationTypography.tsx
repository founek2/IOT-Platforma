import { Breadcrumbs, Link as LinkMUI } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface LocationTypographyProps {
    location: {
        building: string;
        room?: string;
    };
    showRootSlash?: boolean;
}

export function LocationTypography({ location, showRootSlash }: LocationTypographyProps) {
    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: 24,
            }}
        >
            <Link to={`/building`}>
                <LinkMUI underline="hover" color="inherit">
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
