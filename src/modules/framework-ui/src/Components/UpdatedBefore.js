import React, { useState, useCallback, useEffect } from 'react'
import { Typography } from '@material-ui/core';
import getLastUpdateText from '../utils/getLastUpdateText'

// TODO Tests
function UpdatedBefore({ time, prefix, ...other }) {
     const [val, updateState] = React.useState(0);
     const forceUpdate = React.useCallback(() => updateState(1 + val), [val]);  // ++val is causing after some time "read only exception"

     const [text, timeOut] = getLastUpdateText(time, prefix)
     useEffect(() => {
          console.log("timeout", timeOut, "s", text)
          let timeout;
          if (timeOut) timeout = setTimeout(forceUpdate, timeOut * 1000)
          return () => clearTimeout(timeout)
     }, [val, time])

     useEffect(() => {
          console.log("on focus")
          const fn = () => updateState((state) => ++state)
          window.addEventListener('focus', fn)
          return () => window.removeEventListener('focus', fn)
     }, [updateState])
     return (
          <Typography {...other}>
               {text}
          </Typography>
     )
}

export default UpdatedBefore