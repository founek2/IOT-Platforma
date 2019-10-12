import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import Box from './components/BorderBox';
import Loader from 'framework-ui/src/Components/Loader'

const styles = theme => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#52d869',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
})

function MySwitch({ classes, name, description, onClick,value, className, ...props }) {
    const [pending, setPending] = useState(false)

    async function handleClick(e) {
        setPending(true)
        await onClick(e.target.checked ? 1 : 0)
        setPending(false)
    }
    return (
        <Box className={className} onClick={() => handleClick({target: {checked: !value}})}>
            <Typography>{name}</Typography>
            <Switch
                focusVisibleClassName={classes.focusVisible}
                disableRipple
                classes={{
                    root: classes.root,
                    switchBase: classes.switchBase,
                    thumb: classes.thumb,
                    track: classes.track,
                    checked: classes.checked,
                }}
                disabled={pending}
                {...props}
                // onClick={handleClick}
                checked={!!value}
            />
            <Loader open={pending} className="marginAuto"/>
        </Box>
    )
}

export default withStyles(styles)(MySwitch)