import { makeStyles, Paper, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import clsx from "clsx";
import { ComponentType, IThing, IThingProperty } from "common/lib/models/interface/thing";
import { SensorIcons } from "frontend/src/components/SensorIcons";
import { useAppSelector } from "frontend/src/hooks";
import { Device } from "frontend/src/store/reducers/application/devices";
import { Thing } from "frontend/src/store/reducers/application/things";
import { getThing } from "frontend/src/utils/getters";
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
    devices: Device[];
    className?: string;
}

interface SensorBadgesProps {
    thingId: Thing["_id"]
}
function SensorBadges({ thingId }: SensorBadgesProps) {
    const badges: JSX.Element[] = []
    const thing = useAppSelector(getThing(thingId))
    if (thing?.config.componentType !== ComponentType.sensor) return badges

    thing.config.properties.forEach((property) => {
        if (property.propertyClass)
            badges.push(
                <SimpleSensor
                    thing={thing}
                    property={property as IThingPropertyWithDeviceClass}
                    key={property._id}
                />
            );
    });

    return badges
}

function RoomWidget({ devices, className }: RoomProps) {
    const classes = useStyles();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("md"));
    const sensorsLimit = isSmall ? 3 : 4;
    const location = devices[0].info.location;

    let sensors: (JSX.Element | null)[] = [];
    devices.forEach((device) => {
        device.things.forEach((thingId) => {
            const badges = SensorBadges({ thingId })
            sensors = [...sensors, ...badges]
        })
    });
    return (
        <Paper className={clsx(className, classes.widget)} elevation={3}>
            <Typography variant="h3" className={clsx(classes.title, classes.center)}>
                {location.room}
            </Typography>
            <div className={classes.sensorsGrid}>{sensors.slice(0, sensorsLimit)}</div>
        </Paper>
    );
}

export default RoomWidget;
