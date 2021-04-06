import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { drop, head } from "ramda";
import React from "react";
import { BoxWidgetProps } from "./components/BorderBox";
import boxHoc from "./components/boxHoc";
import { SimpleDialog } from "./components/Dialog";
import PropertyRow from "./components/PropertyRow";
import Switch from "./components/Switch";
import switchCss from "./components/switch/css";

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

function MySwitch({ onClick, deviceId, thing, className, fetchHistory, disabled }: BoxWidgetProps) {
    const classes = useStyles();
    const property = head(thing.config.properties)!;
    const value = (thing.state?.value || { [property.propertyId]: "false" })[property.propertyId];
    const [openDialog, setOpenDialog] = React.useState(false);

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

export const Content = MySwitch;

export default boxHoc(Content);
