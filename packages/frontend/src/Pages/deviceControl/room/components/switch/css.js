export default (theme) => ({
    switchRoot: {
        width: 42,
        height: 26,
        padding: 0,
        paddin: theme.spacing(1)
    },
    // switchContainer: {
    //     margin: '0 auto'
    //     // paddingTop: 10
    // },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#52d869',
                opacity: 1,
                border: 'none'
            }
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff'
        }
    },
    thumb: {
        width: 24,
        height: 24
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create([ 'background-color', 'border' ])
    },
    checked: {},
    focusVisible: {},
    disabled: {
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.grey[400],
            '& + $track': {
                backgroundColor: '#000',
                opacity: 0.12
            }
        }
    }
});
