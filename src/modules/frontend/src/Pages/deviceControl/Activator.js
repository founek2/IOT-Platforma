import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography';
import Loader from 'framework-ui/src/Components/Loader'
import boxHoc from './components/boxHoc'

const styles = {
    button: {
        marginTop: 3,
        paddingBottom: 5,
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    header: {
        height: "1.7em",
        overflow: 'hidden',
    },
    circle: {
        top: 3,
        right: 3,
        position: 'absolute',
    }
}


function Activator({ classes, name, onClick, data, ackTime, afk }) {
    const [pending, setPending] = useState(false)
    const { updatedAt, inTransition } = data;

    async function handleClick() {
        setPending(true)
        await onClick(1)
        setPending(false)
    }

    return (
        <div onClick={() => !afk && handleClick()} className={classes.root}>
            <Typography className={classes.header}>{name}</Typography>
            <IconButton aria-label="delete" className={classes.button} disabled={afk}>
                <SendIcon fontSize="large" className={classes.icon} />
            </IconButton>
            <Loader open={pending} className="marginAuto" />
        </div>)
}

export default boxHoc(withStyles(styles)(Activator))