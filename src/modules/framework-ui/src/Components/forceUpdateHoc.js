import React, { Fragment, useState, useEffect, useCallback, Component } from 'react'
import getLastUpdateText from 'framework-ui/src/utils/getLastUpdateText'

/**
 * Force update here, because need update circle text/color and disable button when afk
 * Add Box as warpper and forcing update by prop ackTime
 * @param {*} param0 
 */
export default function (WrappedComponent) {
    return function ({ updateTime, ...props }) {
        const [val, updateState] = useState(0);
        const forceUpdate = useCallback(() => updateState(1 + val), [val]);  // ++val is causing after some time "read only exception"
        const [_, timeOut] = getLastUpdateText(new Date(updateTime))
       

        useEffect(() => {
            console.log("timeout", timeOut, "s")
            let timeout;
            if (timeOut) timeout = setTimeout(forceUpdate, timeOut * 1000)
            return () => clearTimeout(timeout)
        }, [val, updateTime])

        useEffect(() => {
            console.log("on focus")
            window.addEventListener('focus', forceUpdate)
            return () => window.removeEventListener('focus', forceUpdate)
        }, [updateState])

        return  <WrappedComponent forceUpdate={val} {...props} />
    }
}