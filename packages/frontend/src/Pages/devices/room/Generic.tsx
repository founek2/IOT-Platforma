import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import UpdatedBefore from "framework-ui/lib/Components/UpdatedBefore";
import React, { useEffect } from "react";
import type { BoxWidgetProps } from "./components/BorderBox";
import boxHoc from "./components/boxHoc";
import { SimpleDialog } from "./components/Dialog";
import PropertyRow from "./components/PropertyRow";

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        height: "100%",
        cursor: "pointer",
        justifyContent: "center",
    },
    circle: {
        top: 3,
        right: 3,
        position: "absolute",
    },
    container: {
        fontSize: 25,
        display: "flex",
        justifyContent: "center",
    },
    icon: {
        marginRight: 5,
    },
    graphTitle: {
        marginBottom: 10,
    },
    updatedBefore: {
        textAlign: "center",
        marginBottom: 10,
    },
});

function Generic({ onClick, deviceId, thing, room, fetchHistory }: BoxWidgetProps) {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = React.useState(false);
    const title = room + " - " + thing.config.name!;

    useEffect(() => {
        if (openDialog) fetchHistory();
    }, [openDialog]);

    return (
        <>
            <div
                className={classes.root}
                onClick={(e) => {
                    console.log("clicked", e.target);
                    setOpenDialog(true);
                }}
            >
                <Typography >{thing.config.name}</Typography>
            </div>
            <SimpleDialog
                open={openDialog}
                onClose={() => {
                    console.log("closing");
                    setOpenDialog(false);
                }}
                title={title}
                deviceId={deviceId}
                thing={thing}
            >
                <div>
                    {thing.config.properties.map((property) => (
                        <PropertyRow
                            key={property.propertyId}
                            property={property}
                            value={thing.state?.value[property.propertyId]}
                            onChange={(newValue) => onClick({ [property.propertyId]: newValue })}
                        />
                    ))}
                </div>
                {thing.state?.timestamp ? (
                    <UpdatedBefore
                        time={new Date(thing.state.timestamp)}
                        variant="body2"
                        prefix="Aktualizováno před"
                        className={classes.updatedBefore}
                    />
                ) : null}
            </SimpleDialog>
        </>
    );

}

export default boxHoc(Generic);
