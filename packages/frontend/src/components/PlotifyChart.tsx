import React from 'react';
import PlotifyChartTsES, { IPlotlyChartProps } from 'react-plotlyjs-ts/dist/index.js';
const PlotifyChartTs = PlotifyChartTsES.default;

function PlotifyChart(props: IPlotlyChartProps) {
    return <PlotifyChartTs {...props} />;
}

export default PlotifyChart;
