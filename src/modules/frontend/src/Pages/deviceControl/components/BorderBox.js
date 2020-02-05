import React, { Fragment, useState, useEffect, useCallback, Component, Children } from 'react'
import Box from '@material-ui/core/Box';
import getLastUpdateText from 'framework-ui/src/utils/getLastUpdateText'

const defaultProps = {
    bgcolor: 'background.paper',
    m: 1,
    border: 1,
    style: { padding: "1rem" },
    position: "relative",
};

function BorderBox({ children, className, ackTime, component, ...other }) {
    function handleContext(e){
        e.preventDefault()
        console.log("context")
    }
    const Component = component
    return (
        <Box
            display="inline-block"
            borderRadius={10}
            borderColor="grey.400"
            className={className ? className : ""}
            onContextMenu={handleContext}
            {...defaultProps}
            {...other}>
                {children}
        </Box>)
}

export default BorderBox