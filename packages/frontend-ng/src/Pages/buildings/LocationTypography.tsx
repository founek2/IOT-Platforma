import Typography from '@mui/material/Typography';
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
    const linkToRoot = <Link to="/building">/</Link>;
    const linkToBuilding = <Link to={`/building/${location.building}`}>{location?.building}</Link>;

    return (
        <Typography sx={{ flex: '1 0 100%', textAlign: 'center' }} variant="h4">
            {showRootSlash ? linkToRoot : null}
            {linkToBuilding}

            {location.room && '/'}
            <wbr />
            {location.room}
        </Typography>
    );
}
