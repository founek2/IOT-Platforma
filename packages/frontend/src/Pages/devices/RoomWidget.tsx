import { makeStyles, Paper, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import clsx from "clsx";
import { IDevice } from "common/lib/models/interface/device";
import { ComponentType, IThing, IThingProperty } from "common/lib/models/interface/thing";
import { SensorIcons } from "frontend/src/components/SensorIcons";
import React from "react";

const useStyles = makeStyles((theme) => ({
    widget: {
        display: "flex",
        padding: theme.spacing(3),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1.5),
            flexDirection: "column"
        }
    },
    title: {
        color: grey[700],
        paddingRight: 10,
        [theme.breakpoints.down("sm")]: {
            fontSize: "3em"
        }
    },
    sensorsGrid: {
        display: "flex",
        flexWrap: "wrap",
        flexGrow: 1,
    },
    sensorContainer: {
        flex: "1 0 22%",
        padding: 5,
    },
    sensorIcon: {
        verticalAlign: "middle",
        fontSize: 20,
        marginRight: 5,
    },
    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    // centerIcons: {
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     [theme.breakpoints.down("sm")]: {
    //         justifyContent: "flex-end",
    //     }
    // },
}));
type IThingPropertyWithDeviceClass = IThingProperty & { propertyClass: NonNullable<IThingProperty["propertyClass"]> };
interface SimpleSensorProps {
    thing: IThing;
    property: IThingPropertyWithDeviceClass;
}
function SimpleSensor({ thing, property }: SimpleSensorProps) {
    const classes = useStyles();
    const Icon = SensorIcons[property.propertyClass];

    const value = thing.state?.value && thing.state?.value[property.propertyId];

    if (!value) return null;

    return (
        <div className={clsx(classes.sensorContainer, classes.center)}>
            <Icon className={classes.sensorIcon} />
            <Typography component="span">
                {value}&nbsp;{property.unitOfMeasurement}
            </Typography>
        </div>
    );
}

interface RoomProps {
    devices: IDevice[];
    className?: string;
}
function RoomWidget({ devices, className }: RoomProps) {
    const classes = useStyles();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("md"));
    const sensorsLimit = isSmall ? 3 : 4;
    const location = devices[0].info.location;

    const sensors: JSX.Element[] = [];
    devices.forEach((device) => {
        device.things.forEach((thing) => {
            if (thing.config.componentType === ComponentType.sensor)
                thing.config.properties.forEach((property) => {
                    if (property.propertyClass && sensors.length < sensorsLimit)
                        sensors.push(
                            <SimpleSensor
                                thing={thing}
                                property={property as IThingPropertyWithDeviceClass}
                                key={property._id}
                            />
                        );
                });
        });
    });
    return (
        <Paper className={clsx(className, classes.widget)} elevation={3}>
            <Typography variant="h3" className={clsx(classes.title, classes.center)}>
                {location.room}
            </Typography>
            <div className={classes.sensorsGrid}>{sensors}</div>
        </Paper>
    );
}

export default RoomWidget;
