import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import Box from './components/BorderBox';
import Loader from 'framework-ui/src/Components/Loader'
import switchCss from './components/switch/css'
import Circle from './components/Circle'
import { head } from "ramda";
import getLastUpdateText from 'framework-ui/src/utils/getLastUpdateText'
import UpdatedBefore from 'framework-ui/src/Components/UpdatedBefore'
import isAfk from '../../utils/isAfk'
import getCircleColor from '../../utils/getCircleColor'
import OnlineCircle from '../../components/OnlineCircle';
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
    tooltipText: {
        fontSize: "0.625rem"    // weird behavior -> first tooltip in page is render with in Typography with variant body2
    },
    circle: {
        top: 3,
        right: 3,
        position: 'absolute',
    }
})

function MySwitch({ classes, name, description, onClick, data, className, ackTime,afk, forceUpdate, ...props }) {
    const [pending, setPending] = useState(false)
    const { state, inTransition, transitionStarted, updatedAt } = data;
    async function handleClick(e) {
        setPending(true)
        await onClick(state ? 0 : 1)
        setPending(false)
    }
    console.log("state", state, !!state)
    return (
        <div className={classes.root} onClick={(e) => !afk && handleClick(e)}>
            <OnlineCircle
                inTransition={inTransition}
                ackTime={ackTime}
                changeTime={updatedAt}
                afk={afk}
                className={classes.circle}
            />
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
                    disabled={pending || isAfk(ackTime)}
                    {...props}
                    // onClick={handleClick}
                    checked={!!state}
                />
            </div>
            <Loader open={pending} className="marginAuto" />
        </div>)

}

export default boxHoc(withStyles(styles)(MySwitch))