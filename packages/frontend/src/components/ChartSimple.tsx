import React, { useState } from "react";
import { Chart } from "react-google-charts";
import Loader from "framework-ui/lib/Components/Loader";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ReactGoogleChartEvent, GoogleChartWrapperChartType } from "react-google-charts/dist/types";

const useStyles = makeStyles((theme) => ({
    root: {
        // paddingBottom: 15,
        // marginLeft: "10%"

        [theme.breakpoints.up("sm")]: {
            width: "90%",
            margin: "0 auto",
        },
        // height: 415,
    },
    loader: {
        left: 10,
    },
    loading: {
        display: "flex",
        justifyContent: "center",
    },
    // timeline: { showRowLabels: false },
    // avoidOverlappingGridLines: false,
}));

const options = {
    hAxis: {
        gridlines: { color: "transparent", count: 3 },
        format: "HH:mm",
    },
    vAxis: {
        gridlines: { count: 3 },
        // baseline: 0
    },
    legend: { position: "none" },

    timeline: { showRowLabels: false },
    avoidOverlappingGridLines: false,
};

function getConvertOptionsFunc(chartType: any) {
    // @ts-ignore
    return window.google && window.google.charts && window.google.charts[chartType] // @ts-ignore
        ? window.google.charts[chartType].convertOptions
        : null;
}

interface ChartSimpleProps {
    data: any;
    type?: GoogleChartWrapperChartType,
    formatters?: {
        column: number;
        type: "ArrowFormat" | "BarFormat" | "ColorFormat" | "DateFormat" | "NumberFormat" | "PatternFormat";
        options?: {};
    }[],
    height?: string
}

function ChartSimple({
    data,
    type = "Line",
    formatters,
    height = "auto"
}: //	vAxisTitle, hAxisTitle, minValue
    ChartSimpleProps) {
    const classes = useStyles();

    const [convertFunc, setConvertFunc] = useState<any>(null);

    const chartEvents: ReactGoogleChartEvent[] = [
        {
            eventName: "ready",
            callback(Chart: any) {
                const convertFunc = getConvertOptionsFunc("Line");
                setConvertFunc(() => convertFunc);
            },
        },
    ];
    const finalOptions = convertFunc ? convertFunc(options) : options;
    return (
        <div className={classes.root}>
            <Chart
                width="100%"
                height={height}
                chartType={type}
                legendToggle
                loader={
                    <span className={classes.loading}>
                        Načítám graf
						<Loader open className={classes.loader} />
                    </span>
                }
                data={data}
                formatters={formatters}
                // options={finalOptions}
                options={finalOptions}
                chartEvents={convertFunc ? undefined : chartEvents}
                chartLanguage="cs"
            />
        </div>
    );
}

export default ChartSimple;
