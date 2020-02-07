import React, { useState, useCallback, useEffect } from 'react'
import { Typography } from '@material-ui/core';
import getLastUpdateText from '../utils/getLastUpdateText'
import forceUpdateHoc from './forceUpdateHoc';

// TODO Tests
function UpdatedBefore({ time, prefix, forceUpdate, ...other }) {
     const [text] = getLastUpdateText(time, prefix)

     return (
          <Typography {...other}>
               {text}
          </Typography>
     )
}

export default forceUpdateHoc(UpdatedBefore)