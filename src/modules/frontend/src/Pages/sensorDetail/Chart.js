import React, { useState } from 'react'
import { Chart } from 'react-google-charts';
import Loader from 'framework-ui/src/Components/Loader'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    root: {
        paddingBottom: 15,
        // marginLeft: "10%"
    },
    loader: {
        left: 100,
        top: -8
    },
})

const options = (hAxisTitle,vAxisTitle) => ({
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
        minorGridlines: {
            count: 0,
        },
        textStyle: { color: '#b0bec5', fontName: 'Roboto', fontSize: '12', bold: true },
    },
    legend: { position: 'top', alignment: 'center', textStyle: { color: '#607d8b', fontName: 'Roboto', fontSize: '12' } },

    vAxis: {
        title: vAxisTitle,
        gridlines: { color: '#37474f', count: 4 },
        baselineColor: 'transparent',
         minValue: 0, 
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
        axis: 'horizontal',
        keepInBounds: true,
        maxZoomIn: 4.0
    },
    colorAxis: { colors: ["#3f51b5", "#2196f3", "#03a9f4", "#00bcd4"] },
    backgroundColor: 'transparent',
    areaOpacity: 0.24,
    // lineWidth: 1,
    colors: ["#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39"],
    // interpolateNulls: true
})

function getConvertOptionsFunc(chartType) {
    if (window.google && window.google.charts) {
        const keyssss = Object.keys(window.google.charts)
    }
    return window.google && window.google.charts && window.google.charts[chartType]
        ? window.google.charts[chartType].convertOptions
        : null;
}


function MyChart({ classes, fetchData, data, vAxisTitle, hAxisTitle }) {
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
                width="90%"
                height="400px"

                chartType="LineChart"
                legendToggle
                loader={<span>Načítám graf<Loader open className={classes.loader} /></span>}
                data={data}
                // options={finalOptions}
                options={options(hAxisTitle,vAxisTitle)}
                rootProps={{ 'data-testid': '2' }}
                chartEvents={convertFunc ? null : chartEvents}
                chartLanguage="cs"
            /></div>
    );
}

export default withStyles(styles)(MyChart)