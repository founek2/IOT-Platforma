import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import Box from './components/BorderBox';
import Loader from 'framework-ui/src/Components/Loader'
import switchCss from './components/switch/css'
import Circle from './components/Circle'

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
    }
})

function isAfk(ackTime){
    return !ackTime || new Date() - new Date(ackTime) > 10 * 60 * 1000
}

function getColor(inTransition, transitionStarted, ackTime) {
    console.log(new Date() - new Date(transitionStarted), transitionStarted)
    if (isAfk(ackTime)) // afk for more then 10min
        return "red"
    else if (inTransition && new Date() - new Date(transitionStarted) > 2 * 1000)
        return "orange"
    return "green"
}

// TODO pokud nedojde ke změně updateAt do 2s, tak změnit stav zpět a zvýraznit offline zařízení
// stejně tak offline při ack starším než ->
function MySwitch({ classes, name, description, onClick, data, className, ackTime, ...props }) {
    const [pending, setPending] = useState(false)
    const { state, inTransition, transitionStarted } = data;
    async function handleClick(e) {
        // TODO when still in transition -> show warning or something
        setPending(true)
        await onClick(e.target.checked ? 1 : 0)
        setPending(false)
    }
    const disabled = isAfk(ackTime);
    return (
        <Box className={className} onClick={() => !disabled && handleClick({ target: { checked: !state } })}>
            <div className={classes.root}>
                <Circle color={getColor(inTransition, transitionStarted, ackTime)} />
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
                        disabled={pending || disabled}
                        {...props}
                        // onClick={handleClick}
                        checked={!!state}
                    />
                </div>
                <Loader open={pending} className="marginAuto" />
            </div>
        </Box>
    )
}

export default withStyles(styles)(MySwitch)