import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { IThingPropertyEnum } from 'common/src/models/interface/thing';
import { head } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';
import { ActivatorButton } from './components/ActivatorButton';
import type { BoxWidgetProps } from './components/BorderBox';
import boxHoc from './components/boxHoc';
import { CopyUrlContext } from './components/helpers/CopyUrl';

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
    select: {
        paddingLeft: 5,
    },
}));

function Activator({ onClick, deviceId, thing, className, disabled }: BoxWidgetProps) {
    const classes = useStyles();
    const property = head(thing.config.properties)! as IThingPropertyEnum;
    const value = (thing.state?.value || { [property.propertyId]: 'false' })[property.propertyId];

    return (
        <div className={clsx(className, classes.root)}>
            <Link to={{ search: `?thingId=${thing._id}&deviceId=${deviceId}` }}>
                <Typography className={classes.header}>{thing.config.name}</Typography>
            </Link>
            <div className={classes.verticalAlign}>
                {property.format.length === 1 ? (
                    <div className={classes.switchContainer}>
                        <CopyUrlContext propertyId={property.propertyId} value={head(property.format) as string}>
                            <ActivatorButton
                                disabled={disabled}
                                onClick={() =>
                                    onClick({
                                        [property.propertyId]: head(property.format),
                                    })
                                }
                            />
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
        </div>
    );
}

export default boxHoc(Activator);
