import React, {useState, useCallback} from 'react'
import { Typography } from '@material-ui/core';

function getText(time) {
    const now = new Date();
	
	if (now - time < 0)
		return ['Aktuální', 20 * 1000];

	const diff = new Date(now - time);

     if ((now.getYear() - time.getYear()) > 0) {
          return ['Poslední aktualizace před ' + Number(now.getYear() - time.getYear()) + ' rok', null];
     } else if (diff.getMonth() > 0) {
          return ['Poslední aktualizace před ' + diff.getMonth() + ' měsíc', null];
     } else if (diff.getDate() - 1 > 0) {
          return ['Poslední aktualizace před ' + diff.getDate() + ' dny', 60 * 60 * 1000];
     } else if (diff.getHours() > 1) {
          return ['Poslední aktualizace před ' + diff.getHours() + ' hod', 15 * 60 * 1000];
     } else if (diff.getMinutes() > 0) {
          return ['Poslední aktualizace před ' + diff.getMinutes() + ' min', 50 * 1000];
	}else if (diff.getMinutes() === 0) {
          return ['Aktuální', 20 * 1000];
     }
}

// TODO zvniká leak, při unmounted komponentě
function UpdatedBefore({time, ...other}) {
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const [text, timeOut] = getText(time)
    if (timeOut) setTimeout(forceUpdate,timeOut)
    return(
        <Typography {...other}>
            {text}
        </Typography>
    )
}

export default UpdatedBefore