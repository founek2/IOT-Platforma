import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import Loader from 'framework-ui/src/Components/Loader'
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

function MySwitch({ classes, name, description, onClick, data, className, ackTime,afk, forceUpdate, ...props }) {
    const [pending, setPending] = useState(false)
    const { state } = data;
    async function handleClick(e) {
        setPending(true)
        await onClick(state ? 0 : 1)
        setPending(false)
    }

    return (
        <div className={classes.root} onClick={(e) => !afk && handleClick(e)}>
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
            <Loader open={pending} className="marginAuto" />
        </div>)

}

export default boxHoc(withStyles(styles)(MySwitch))