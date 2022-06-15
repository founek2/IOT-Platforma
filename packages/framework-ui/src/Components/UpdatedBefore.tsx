import React from 'react';
import { Typography } from '@material-ui/core';
import getLastUpdateText from '../utils/getLastUpdateText';
import forceUpdateHoc from './forceUpdateHoc';

// TODO Tests
function UpdatedBefore({ time, prefix, forceUpdate, forwardRef, ...other }) {
    console.log('time', time);
    const [text] = getLastUpdateText(time, prefix);
    return (
        <div className="textCenter">
            <Typography
                display="inline"
                {...other}
                ref={forwardRef}
                title={time instanceof Date ? time.toLocaleString() : ''}
            >
                {text}
            </Typography>
        </div>
    );
}

export default React.forwardRef(forceUpdateHoc(UpdatedBefore));
