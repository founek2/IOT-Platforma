import React, { Fragment, useState, useEffect, useCallback, Component } from 'react'
import getLastUpdateText from 'framework-ui/src/utils/getLastUpdateText'
import isAfk from '../../../utils/isAfk'
import Box from './BorderBox'

/**
 * Force update here, because need update circle text/color and disable button when afk
 * Add Box as warpper and forcing update by prop ackTime
 * @param {*} param0 
 */
export default function (WrappedComponent) {
    return function ({data, ackTime, className, ...props}) {
        const [val, updateState] = useState(0);
        const forceUpdate = useCallback(() => updateState(1 + val), [val]);  // ++val is causing after some time "read only exception"
        const [_, timeOut] = getLastUpdateText(new Date(ackTime))
        const afk = isAfk(ackTime);

        useEffect(() => {
            console.log("timeout", timeOut, "s")
            let timeout;
            if (timeOut) timeout = setTimeout(forceUpdate, timeOut * 1000)
            return () => clearTimeout(timeout)
        }, [val, ackTime])

        useEffect(() => {
            console.log("on focus")
            window.addEventListener('focus', forceUpdate)
            return () => window.removeEventListener('focus', forceUpdate)
        }, [updateState])

        return (
            <Box
                className={className}
                data={data}
                ackTime={ackTime}>
                <WrappedComponent forceUpdate={val} data={data} ackTime={ackTime} afk={afk} {...props}/>
            </Box>
        )
    }
}