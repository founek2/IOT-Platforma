import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import switchCss from "./components/switch/css";
import boxHoc from "./components/boxHoc";
import ControlContextMenu from "./components/ControlContextMenu";
import { BoxWidgetProps } from "./components/BorderBox";
import Switch from "./components/Switch"
import { head, drop } from "ramda";
import { SimpleDialog } from "./components/Dialog";
import PropertyRow from "./components/PropertyRow";

const useStyles = makeStyles((theme) => ({
    ...switchCss(theme),
    root: {
        display: "flex",
        flexDirection: "column",
    },
    header: {
        height: "3em", // I hope it is for 2 lines
        overflow: "hidden",
        textAlign: "center",
        cursor: "pointer"
    },
}));

function MySwitch({ onClick, deviceId, thing, room, fetchHistory, disabled }: BoxWidgetProps) {
    const classes = useStyles();
    const property = head(thing.config.properties)!;
    const value = (thing.state?.value || { [property.propertyId]: "false" })[property.propertyId];
    const [openDialog, setOpenDialog] = React.useState(false);

    return (
        <ControlContextMenu
            name={thing.config.name}
            //  JSONkey={JSONkey}
            render={({ handleOpen }: any) => {
                return (
                    <div
                        className={classes.root}
                    >
                        <div className={classes.header} onContextMenu={handleOpen} onClick={() => setOpenDialog(true)}>
                            <Typography component="span">{thing.config.name}</Typography>
                        </div>
                        <div
                            className={classes.switchContainer}
                            onClick={(e) => !disabled && onClick({
                                [property.propertyId]: value === "true" ? "false" : "true"
                            })}>
                            <Switch
                                disabled={disabled}
                                // onClick={handleClick}
                                checked={value === "true"}
                            />
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
            }}
        />
    );
}

export const Content = MySwitch;

export default boxHoc(Content);
