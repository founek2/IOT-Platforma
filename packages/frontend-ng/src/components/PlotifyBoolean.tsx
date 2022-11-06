import { Box, CircularProgress } from '@mui/material';
import { subDays } from 'date-fns';
import React, { lazy, Suspense } from 'react';

const PlotlyChart = lazy(() => import(/* webpackChunkName: 'PlotifyChart' */ './PlotifyChart'));

const layout = {
    // width: 600,
    colorway: ['#4E86EC', '#DC3912', '#FF9900', '#109618', '#990099', '#0099C6', '#DD4477'],
    autosize: true,
    height: 70,
    yaxis: {
        showgrid: false,
        range: [0, 1],
        nticks: 2,
        zeroline: false,
    },
    xaxis: {
        tickformat: '%H:%M',
        showgrid: false,
        range: [subDays(new Date(), 1), new Date()],
        zeroline: false,
    },
    margin: {
        b: 30,
        t: 10,
        l: 40,
        r: 0,
        pad: 10,
    },
    orientation: 'v',
};

interface ChartSimpleProps {
    data: Array<any>;
}

function PlotifyBoolean({ data }: ChartSimpleProps) {
    return (
        <Box
            sx={(theme) => ({
                root: {
                    paddingBottom: theme.spacing(2),
                    // marginLeft: "10%"

                    [theme.breakpoints.up('sm')]: {
                        width: '90%',
                        margin: '0 auto',
                    },
                    // height: 415,
                },
                loader: {
                    left: 10,
                },
                loading: {
                    display: 'flex',
                    justifyContent: 'center',
                },
                // timeline: { showRowLabels: false },
                // avoidOverlappingGridLines: false,
            })}
        >
            <Suspense fallback={<CircularProgress />}>
                <PlotlyChart data={data} layout={layout} config={{ displayModeBar: false }} />
            </Suspense>
        </Box>
    );
}

export default PlotifyBoolean;
