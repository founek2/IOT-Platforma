import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { drop, head } from "ramda";
import React, { useEffect, useMemo } from "react";
import type { BoxWidgetProps } from "./components/BorderBox";
import boxHoc from "./components/boxHoc";
import { SimpleDialog } from "./components/Dialog";
import PropertyRow from "./components/PropertyRow";
import Switch from "./components/Switch";
import switchCss from "./components/switch/css";
import ChartSimple from "frontend/src/components/ChartSimple";
import { useSelector } from "react-redux";
import { IState } from "frontend/src/types";
import { HistoricalGeneric } from "common/lib/models/interface/history";
import { IThingProperty } from "common/lib/models/interface/thing";
import { getThingHistory } from "frontend/src/utils/getters";

const useStyles = makeStyles((theme) => ({
    ...switchCss(theme),
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    header: {
        // height: "3em", // I hope it is for 2 lines
        paddingBottom: "0.4em",
        overflow: "hidden",
        textAlign: "center",
        cursor: "pointer"
    },
    switchContainer: {
        // margin: "0 auto",
        dispaly: "inline-box",
        padding: "5px 10px 5px 10px",
        cursor: "pointer",
    },
    verticalAlign: {
        display: "flex",
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "center"
    }
}));

function MySwitch({ onClick, deviceId, thing, className, fetchHistory, disabled, room }: BoxWidgetProps) {
    const classes = useStyles();
    const property = head(thing.config.properties)!;
    const value = (thing.state?.value || { [property.propertyId]: "false" })[property.propertyId];
    const historyData = useSelector<IState, IState["application"]["thingHistory"]>(getThingHistory as any);
    const [openDialog, setOpenDialog] = React.useState(false);
    const title = room + " - " + thing.config.name!;

    useEffect(() => {
        if (openDialog) fetchHistory();
    }, [openDialog]);

    const chartData = useMemo(() => mergeData(historyData.data as HistoricalGeneric[], property.propertyId), [
        historyData.data.length > 0 && historyData.data[0].first,
        historyData.data.length > 0 && historyData.data[historyData.data.length - 1].last,
        historyData.thingId === thing._id,
    ]);

    console.log("chart data", chartData)
    return (
        <div
            className={clsx(className, classes.root)}
        >
            <div className={classes.header} onClick={() => setOpenDialog(true)}>
                <Typography component="span">{thing.config.name}</Typography>
            </div>
            <div className={classes.verticalAlign}>
                <div
                    className={classes.switchContainer}
                    onClick={(e) => !disabled && onClick({
                        [property.propertyId]: value === "true" ? "false" : "true"
                    })}>
                    <Switch
                        disabled={disabled}
                        checked={value === "true"}
                    />
                </div>
            </div>

            <SimpleDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title={thing.config.name}
                deviceId={deviceId}
                thing={thing}
            >
                {historyData.deviceId === deviceId && historyData.thingId === thing._id && chartData.length > 2 ? (
                    <ChartSimple
                        type="Timeline"
                        data={[[
                            { type: 'string', id: 'Room' },
                            { type: 'string', id: 'Name' },
                            { type: 'date', id: 'Start' },
                            { type: 'date', id: 'End' },
                        ],
                        ...chartData]}
                    />
                ) : null}
                <div>
                    {drop(1, thing.config.properties).map((property) => (
                        <PropertyRow
                            key={property.propertyId}
                            property={property}
                            value={thing.state?.value[property.propertyId]}
                            onChange={(newValue) => onClick({ [property.propertyId]: newValue })}
                        />
                    ))}
                </div>
            </SimpleDialog>
        </div>
    );
}

function mergeData(data: HistoricalGeneric[], propertyId: IThingProperty["propertyId"]) {
    if (!propertyId) return [];

    let result: Array<[string, string | null, Date, Date]> = [];

    data.forEach((doc, idx) => {
        const samples = doc.properties[propertyId]?.samples
        if (samples) {
            for (let i = 0; i < samples.length; i++) {
                const rec = samples[i]
                if (samples[i].value === "true") {
                    while ((i + 1) < samples.length) {
                        i += 1;
                        if (samples[i].value === "false") {
                            result.push([
                                "Zapnuto", "",
                                new Date(rec.timestamp),
                                new Date(samples[i].timestamp)
                            ])
                            break;
                        }
                    }
                    if (idx === data.length - 1 && samples[i].value !== "false") {
                        result.push([
                            "Zapnuto", "",
                            new Date(rec.timestamp),
                            new Date()
                        ])
                    }
                }
            }
        }

    })

    return result;
}


export const Content = MySwitch;

export default boxHoc(Content);

