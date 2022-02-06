import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useAppSelector } from 'frontend/src/hooks';
import { getThingHistory } from 'frontend/src/utils/getters';
import { head } from 'ramda';
import React, { useEffect } from 'react';
import type { BoxWidgetProps } from './components/BorderBox';
import boxHoc from './components/boxHoc';
import { SimpleDialog } from './components/Dialog';
import { CopyUrlContext } from './components/helpers/CopyUrl';
import { toogleSwitchVal } from './components/helpers/toogleSwitchVal';
import PropertyRow from './components/PropertyRow';
import Switch from './components/Switch';
import switchCss from './components/switch/css';

const useStyles = makeStyles((theme) => ({
    ...switchCss(theme),
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        // height: "3em", // I hope it is for 2 lines
        paddingBottom: '0.4em',
        overflow: 'hidden',
        textAlign: 'center',
        cursor: 'pointer',
    },
    switchContainer: {
        // margin: "0 auto",
        dispaly: 'inline-box',
        padding: '5px 10px 5px 10px',
        cursor: 'pointer',
    },
    verticalAlign: {
        display: 'flex',
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    dialogContent: {
        minHeight: 150,
    },
}));

function MySwitch({ onClick, deviceId, thing, className, fetchHistory, disabled, room }: BoxWidgetProps) {
    const classes = useStyles();
    const property = head(thing.config.properties)!;
    const value = (thing.state?.value || { [property.propertyId]: 'false' })[property.propertyId];
    const historyData = useAppSelector(getThingHistory);
    const [openDialog, setOpenDialog] = React.useState(false);
    const title = room + ' - ' + thing.config.name!;

    useEffect(() => {
        if (openDialog) fetchHistory();
    }, [openDialog, fetchHistory]);

    return (
        <div className={clsx(className, classes.root)}>
            <div className={classes.header} onClick={() => setOpenDialog(true)}>
                <Typography component="span">{thing.config.name}</Typography>
            </div>
            <div className={classes.verticalAlign}>
                <div
                    className={classes.switchContainer}
                    onClick={(e) =>
                        !disabled &&
                        onClick({
                            [property.propertyId]: toogleSwitchVal(value),
                        })
                    }
                >
                    <CopyUrlContext propertyId={property.propertyId} value={value}>
                        <Switch disabled={disabled} checked={value === 'true'} />
                    </CopyUrlContext>
                </div>
            </div>

            <SimpleDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title={title}
                deviceId={deviceId}
                thing={thing}
                classContent={classes.dialogContent}
            >
                <div>
                    {thing.config.properties.map((property, i) => (
                        <PropertyRow
                            key={property.propertyId}
                            property={property}
                            value={thing.state?.value[property.propertyId]}
                            onChange={(newValue) => onClick({ [property.propertyId]: newValue })}
                            history={historyData?.deviceId === deviceId ? historyData : undefined}
                            defaultShowDetail={i === 0}
                        />
                    ))}
                </div>
            </SimpleDialog>
        </div>
    );
}

export const Content = MySwitch;

export default boxHoc(Content);
