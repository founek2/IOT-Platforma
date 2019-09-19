import React, { useState, useCallback, useEffect } from 'react'
import { Typography } from '@material-ui/core';

function getText(time) {
     const now = new Date();
     const diff = new Date(now - time);
     const diffSec = Math.round(diff /  1000)
     const min = Math.floor(diffSec / 60)
     const hours = Math.floor(min / 60)
     const days = Math.floor(hours / 24)

     if (diff <= 0 || diffSec < 60)
          // return ['Aktuální', 20 * 1000];
          return ['Aktuální', 60 - diffSec];

     if ((now.getYear() - time.getYear()) > 0) {
          return ['Poslední aktualizace před ' + Number(now.getYear() - time.getYear()) + ' rok', null];
     } else if (diff.getMonth() > 0) {
          return ['Poslední aktualizace před ' + diff.getMonth() + ' měsíc', null];
     } else if (days >= 1) {
          // return ['Poslední aktualizace před ' + diff.getDate() + ' dny', 60 * 60 * 1000];
          return ['Poslední aktualizace před ' + days + ' dny', (days + 1 ) * 24 * 60 * 60 - diffSec];
     } else if (hours >= 1) {
          // return ['Poslední aktualizace před ' + diff.getHours() + ' hod', 15 * 60 * 1000];
          return ['Poslední aktualizace před ' + hours + ' hod', (hours + 1) * 60 * 60  - diffSec];
     } else if (min > 0) {
          // return ['Poslední aktualizace před ' + diff.getMinutes() + ' min', 50 * 1000]
          return ['Poslední aktualizace před ' + min + ' min', (min + 1) * 60  - diffSec];
     } 
     // else if (diff.getMinutes() === 0) {
     //      return ['Aktuální', 20 * 1000];
     // }
}

// TODO Tests
function UpdatedBefore({ time, ...other }) {
     const [val, updateState] = React.useState(0);
     const forceUpdate = React.useCallback(() => updateState(1 + val), [val]);  // ++val is causing after some time "read only exception"

     const [text, timeOut] = getText(time)
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