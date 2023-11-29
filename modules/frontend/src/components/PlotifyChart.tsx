import React from 'react';
import PlotifyChartTs, { IPlotlyChartProps } from 'react-plotlyjs-ts';

function PlotifyChart(props: IPlotlyChartProps) {
    return <PlotifyChartTs {...props} />;
}

export default PlotifyChart;
