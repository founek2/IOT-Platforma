import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography';
import boxHoc from './components/boxHoc'
import ControlContextMenu from './components/ControlContextMenu'

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
        userSelect: 'none',
    },
    circle: {
        top: 3,
        right: 3,
        position: 'absolute',
    }
}


function Activator({ classes, name, onClick, data, ackTime, afk, pending, id, JSONkey }) {
    return (
        <div onClick={() => !afk && !pending && onClick({ on: 1 })} className={classes.root}>
            <ControlContextMenu name={name} id={id} JSONkey={JSONkey} render={({ handleOpen }) => {
                return <Typography className={classes.header} onContextMenu={handleOpen}>{name}</Typography>
            }} />
            <IconButton aria-label="delete" className={classes.button} disabled={afk || pending}>
                <SendIcon fontSize="large" className={classes.icon} />
            </IconButton>
        </div>)
}

export default boxHoc(withStyles(styles)(Activator))