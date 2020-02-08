import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import switchCss from './components/switch/css'
import boxHoc from './components/boxHoc'

const styles = theme => ({
    ...switchCss(theme),
    root: {
        display: 'flex',
        flexDirection: 'column',

    },
    header: {
        height: "3em",   // I hope it is for 2 lines
        overflow: 'hidden',
        textAlign: 'center',
    },
})

function MySwitch({ classes, name, description, onClick, data, ackTime,afk,pending, forceUpdate, ...props }) {
    const { state } = data;

    return (
        <div className={classes.root} onClick={(e) => !afk && !pending && onClick(state ? 0 : 1)}>
            <div className={classes.header}>
                <Typography component="span" >{name}</Typography>
            </div>

            <div className={classes.switchContainer}>
                <Switch
                    focusVisibleClassName={classes.focusVisible}
                    disableRipple
                    classes={{
                        root: classes.switchRoot,
                        switchBase: classes.switchBase,
                        thumb: classes.thumb,
                        track: classes.track,
                        checked: classes.checked,
                        disabled: classes.disabled
                    }}
                    disabled={pending || afk}
                    {...props}
                    // onClick={handleClick}
                    checked={!!state}
                />
            </div>
        </div>)

}

export const Content = withStyles(styles)(MySwitch)

export default boxHoc(Content)