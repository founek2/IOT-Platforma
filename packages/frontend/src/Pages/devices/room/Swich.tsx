import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { head } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';
import type { BoxWidgetProps } from './components/BorderBox';
import boxHoc from './components/boxHoc';
import { CopyUrlContext } from './components/helpers/CopyUrl';
import { toogleSwitchVal } from './components/helpers/toogleSwitchVal';
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
}));

function MySwitch({ onClick, deviceId, thing, className, disabled }: BoxWidgetProps) {
    const classes = useStyles();
    const property = head(thing.config.properties)!;
    const value = thing.state?.[property.propertyId]?.value || false;

    return (
        <div className={clsx(className, classes.root)}>
            <Link to={{ search: `?thingId=${thing._id}&deviceId=${deviceId}` }}>
                <Typography className={classes.header}>{thing.config.name}</Typography>
            </Link>
            <div className={classes.verticalAlign}>
                <div
                    className={classes.switchContainer}
                    onClick={(e) => !disabled && onClick(property.propertyId, toogleSwitchVal(value))}
                >
                    <CopyUrlContext propertyId={property.propertyId} value={value}>
                        <Switch disabled={disabled} checked={value === 'true'} />
                    </CopyUrlContext>
                </div>
            </div>
        </div>
    );
}

export const Content = MySwitch;

export default boxHoc(Content);
