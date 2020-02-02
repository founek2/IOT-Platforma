import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Box from './components/BorderBox';
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import Loader from 'framework-ui/src/Components/Loader'

const styles = theme => ({
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    button: {
        backgroundColor: "#c0c3c0",
        marginTop: 3,
        marginBottom: 3,
    },
    circle: {
        width: 15,
        height: 15,
        backgroundColor: "#62bd19",
        borderRadius: "50%",
        position: "absolute",
        top: 23,
        left: 23,
    }
})

// TODO zobrazit afk při starším updatedAt
function Activator({ classes, name, onClick, data, className }) {
    const [pending, setPending] = useState(false)
    const { state, updatedAt, inTransition } = data;

    async function handleClick(e) {
        setPending(true)
        await onClick(1)
        setPending(false)
    }
    return (
        <Box className={className}>
            <Typography>{name}</Typography>
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                disabled={pending}
                onClick={handleClick}
            >
                Send
        {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
                <SendIcon className={classes.rightIcon} />

            </Button>
            <Loader open={pending} className="marginAuto" />
        </Box>
    )
}

export default withStyles(styles)(Activator)