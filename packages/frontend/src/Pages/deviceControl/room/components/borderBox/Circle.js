import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';

const styles = {
    wrapper: {
        width: 22,
        height: 22,
        borderRadius: '50%',
        display: 'inline-block',
        top: 3,
        right: 3,
        position: 'absolute'
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        left: 6,
        top: 6,
        position: 'absolute'
    },
    green: {
        backgroundColor: '#62bd19'
    },
    red: {
        backgroundColor: '#cd0000'
    },
    orange: {
        backgroundColor: '#e08d0f'
    }
};

const CircleComponent = React.forwardRef(function({ color, classes, ...props }, ref) {
    return (
        <div {...props} ref={ref} className={classes.wrapper}>
            <div className={`${classes.circle} ${classes[color]}`} />
        </div>
    );
});

function Circle({ color, classes, tooltipText }) {
    return (
        <Tooltip title={tooltipText} placement="bottom" arrow={true}>
            <CircleComponent color={color} classes={classes} />
        </Tooltip>
    );
}

export default withStyles(styles)(Circle);
