import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import clsx from 'clsx';
import { IThingPropertyEnum } from 'common/src/models/interface/thing';
import { RootState } from 'frontend/src/store/store';
import { getThingHistory } from 'frontend/src/utils/getters';
import { head } from 'ramda';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { BoxWidgetProps } from './components/BorderBox';
import boxHoc from './components/boxHoc';
import { SimpleDialog } from './components/Dialog';
import { CopyUrlContext } from './components/helpers/CopyUrl';
import PropertyRow from './components/PropertyRow';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        paddingBottom: '0.4em',
        overflow: 'hidden',
        textAlign: 'center',
        cursor: 'pointer',
    },
    switchContainer: {
        // margin: "0 auto",
        cursor: 'pointer',
        display: 'inline-box',
    },
    verticalAlign: {
        display: 'flex',
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    button: {
        padding: '6px 18px 6px 18px',
    },
    select: {
        paddingLeft: 5,
    },
}));

function Activator({ onClick, deviceId, thing, className, room, fetchHistory, disabled }: BoxWidgetProps) {
    const classes = useStyles();
    const property = head(thing.config.properties)! as IThingPropertyEnum;
    const value = (thing.state?.value || { [property.propertyId]: 'false' })[property.propertyId];
    const historyData = useSelector<RootState, RootState['application']['thingHistory']>(getThingHistory as any);
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
                {property.format.length === 1 ? (
                    <div className={classes.switchContainer}>
                        <CopyUrlContext propertyId={property.propertyId} value={head(property.format) as string}>
                            <IconButton
                                aria-label="delete"
                                className={classes.button}
                                disabled={disabled}
                                onClick={() =>
                                    onClick({
                                        [property.propertyId]: head(property.format),
                                    })
                                }
                            >
                                <PowerSettingsNewIcon fontSize="large" />
                            </IconButton>
                        </CopyUrlContext>
                    </div>
                ) : (
                    <CopyUrlContext propertyId={property.propertyId} value={value as string}>
                        <Select
                            className={classes.select}
                            value={value}
                            disabled={disabled}
                            onChange={(e) => {
                                onClick({ [property.propertyId]: e.target.value as string });
                            }}
                            disableUnderline
                        >
                            {property.format.map((label) => (
                                <MenuItem value={label} key={label}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </CopyUrlContext>
                )}
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

export default boxHoc(Activator);
