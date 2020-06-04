import React, { Fragment, useState } from 'react'
import Box from '@material-ui/core/Box';
import getLastUpdateText from 'framework-ui/src/utils/getLastUpdateText'
import { withStyles } from '@material-ui/core/styles'
import OnlineCircle from '../../../components/OnlineCircle';
import isAfk from '../../../utils/isAfk'
import forceUpdateHoc from 'framework-ui/src/Components/forceUpdateHoc'
import ControlDetail from './ControlDetail'
import Loader from 'framework-ui/src/Components/Loader'

const styles = {
    circle: {
        top: 3,
        right: 3,
        position: 'absolute',
    },
    contextMenu: {
        width: "20%",
        height: "20%",
        position: 'absolute',
        right: 0,
        bottom: 0
    }
}

const defaultProps = {
    bgcolor: 'background.paper',
    m: 1,
    border: 1,
    style: { padding: "1rem" },
    position: "relative",
};

function BorderBox({ children, className, data, ackTime, onClick, component, name, classes, forwardRef, ...other }) {
    const [detailOpen, setOpen] = useState(false)
    const [pending, setPending] = useState(false)

    async function handleClick(newState) {
        setPending(true)
        await onClick(newState)
        setPending(false)
    }

    function handleContext(e) {
        e.preventDefault()
        console.log("context")
        setOpen(true)
    }

    const { state, inTransition, transitionStarted, updatedAt } = data;
    const afk = isAfk(ackTime);
    const Component = component
    return (
        <Box
            display="inline-block"
            borderRadius={10}
            borderColor="grey.400"
            className={className ? className : ""}
            {...defaultProps}
        >
            <OnlineCircle
                inTransition={inTransition}
                ackTime={ackTime}
                changeTime={updatedAt}
                afk={afk}
                className={classes.circle}
            />
            <Component data={data} afk={afk} ackTime={ackTime} name={name} onClick={handleClick} pending={pending} {...other} />
            <Loader open={pending} className="marginAuto" />
            <div onContextMenu={handleContext} className={classes.contextMenu}></div>
            <ControlDetail open={detailOpen} data={data} name={name} ackTime={ackTime} handleClose={() => setOpen(false)} />
        </Box>)
}

export default forceUpdateHoc(withStyles(styles)(BorderBox))