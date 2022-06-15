import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import UpdatedBefore from 'framework-ui/src/Components/UpdatedBefore';
import React, { useEffect } from 'react';
import { useAppSelector } from 'src/hooks';
import { getThingHistory } from 'src/utils/getters';
import type { BoxWidgetProps } from './components/BorderBox';
import boxHoc from './components/boxHoc';
import { SimpleDialog } from './components/Dialog';
import PropertyRow from './components/PropertyRow';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        height: '100%',
        cursor: 'pointer',
        justifyContent: 'center',
    },
    circle: {
        top: 3,
        right: 3,
        position: 'absolute',
    },
    container: {
        fontSize: 25,
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 5,
    },
    graphTitle: {
        marginBottom: 10,
    },
    updatedBefore: {
        textAlign: 'center',
        marginBottom: 10,
    },
});

function Generic({ onClick, deviceId, thing, room, fetchHistory }: BoxWidgetProps) {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = React.useState(false);
    const historyData = useAppSelector(getThingHistory);
    const title = room + ' - ' + thing.config.name!;

    useEffect(() => {
        if (openDialog) fetchHistory();
    }, [openDialog, fetchHistory]);

    return (
        <>
            <div className={classes.root} onClick={() => setOpenDialog(true)}>
                <Typography>{thing.config.name}</Typography>
            </div>
            <SimpleDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title={title}
                deviceId={deviceId}
                thing={thing}
            >
                <div>
                    {thing.config.properties.map((property, i) => (
                        <PropertyRow
                            key={property.propertyId}
                            property={property}
                            value={thing.state?.value[property.propertyId]}
                            timestamp={thing.state?.timestamp && new Date(thing.state.timestamp)}
                            onChange={(newValue) => onClick({ [property.propertyId]: newValue })}
                            history={historyData?.deviceId === deviceId ? historyData : undefined}
                            defaultShowDetail={i === 0}
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
