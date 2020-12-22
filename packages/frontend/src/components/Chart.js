import React, { useState } from 'react'
import { Chart } from 'react-google-charts';
import Loader from 'framework-ui/lib/Components/Loader'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    root: {
        paddingBottom: 15,
        // marginLeft: "10%"
        [theme.breakpoints.up('md')]: {
            width: "90%",
            margin: "0 auto"
        }
    },
    loader: {
        left: 10,
    },
    loading: {
        display: "flex",
        justifyContent: "center"
    }
})

// TODO when multiple legends disabling is not working properly -> maybe onClick event and manual remove from dataset

const options = (hAxisTitle, vAxisTitle, minValue) => ({
    // chart: {
    //     title: 'Graf průběhu v čase',
    //     // subtitle: 'in millions of dollars (USD)'
    //   },
    // title: "Graf průběhu v čase",
    hAxis: {
        // format:'#,###%',
        title: hAxisTitle,
        titleTextStyle: { color: '#607d8b' },
        gridlines: {
            count: 3,
            color: 'transparent'
            // units: {
            //     years: {format: ['d. M. yyyy']},
            //     months: {format: ["MMMM"]},
            //     days: { format: ['d. M. HH:mm'] },
            //     hours: { format: ['HH:mm', 'H'] },
            //     minutes: { format: ['HH:mm', ':mm'] }
            // }
        },
        // minorGridlines: {
        //     count: 6,
        // },
        textStyle: { color: '#b0bec5', fontName: 'Roboto', fontSize: '12', bold: true },
    },
    legend: { position: 'top', alignment: 'center', textStyle: { color: '#607d8b', fontName: 'Roboto', fontSize: '12' } },

    vAxis: {
        title: vAxisTitle,
        gridlines: { color: '#37474f', count: 4 },
        baselineColor: 'transparent',
        // minValue: 0,
        viewWindow: {
            min: minValue,
        },
        minorGridlines: {
            count: 0,
            // units: {
            //     hours: { format: ['hh:mm:ss a', 'ha'] },
            //     minutes: { format: ['HH:m a Z', ':mm'] }
            // }
        },
    },
    series: {
        0: { curveType: 'function' },
    },
    explorer: {
        actions: ['dragToZoom', 'rightClickToReset'],
        // actions: ['dragToPan'],
        axis: 'horizontal',
        keepInBounds: true,
        maxZoomIn: 0.1,
        zoomDelta: 1.1
    },
    // animation:{
    //     duration: 400,
    //     easing: 'in',
    //     startup: true
    // },
    colorAxis: { colors: ["#3f51b5", "#2196f3", "#03a9f4", "#00bcd4"] },
    backgroundColor: 'transparent',
    areaOpacity: 0.24,
    // lineWidth: 1,
    colors: ["#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39"],
    // interpolateNulls: true
})

function getConvertOptionsFunc(chartType) {
    return window.google && window.google.charts && window.google.charts[chartType]
        ? window.google.charts[chartType].convertOptions
        : null;
}


function MyChart({ classes, fetchData, data, vAxisTitle, hAxisTitle, chartType, minValue }) {
    const [convertFunc, setConvertFunc] = useState(null)

    const chartEvents = [
        {
            eventName: 'ready',
            callback(Chart) {
                const convertFunc = getConvertOptionsFunc("Line");
                setConvertFunc(() => convertFunc);
            },
        },
    ]

    // const finalOptions = convertFunc ? convertFunc(options) : options;


    return (
        <div className={classes.root} align="center">
            <Chart
                width="100%"
                height="400px"

                chartType={chartType}
                legendToggle
                loader={<span className={classes.loading}>Načítám graf<Loader open className={classes.loader} /></span>}
                data={data}
                // options={finalOptions}
                options={options(hAxisTitle, vAxisTitle, minValue)}
                rootProps={{ 'data-testid': '2' }}
                chartEvents={convertFunc ? null : chartEvents}
                chartLanguage="cs"
            /></div>
    );
}

export default withStyles(styles)(MyChart)