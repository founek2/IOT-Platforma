import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import PlotlyChart from 'react-plotlyjs-ts';

const useStyles = makeStyles((theme) => ({
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
}));

const layout = {
    // width: 600,
    colorway: ['#4E86EC', '#DC3912', '#FF9900', '#109618', '#990099', '#0099C6', '#DD4477'],
    autosize: true,
    height: 200,
    // title: 'A Fancy Plot',
    xaxis: {
        tickformat: '%H:%M',
        showgrid: false,
        nticks: 4,
        // tickmode: 'auto',
    },
    yaxis: {
        nticks: 4,
        tickmode: 'auto',
    },
    margin: {
        b: 30,
        t: 0,
        l: 40,
        r: 0,
        pad: 10,
    },
};

interface ChartSimpleProps {
    data: Array<any>;
}

function PlotifyNumeric({ data }: ChartSimpleProps) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <PlotlyChart data={data} layout={layout} config={{ displayModeBar: false }} />
        </div>
    );
}

export default PlotifyNumeric;
