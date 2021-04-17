import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    pagination: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    tableWrapper: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    toolbar: {
        paddingRight: theme.spacing(4),
        paddingLeft: theme.spacing(4),
    },
}))

export function useManagementStyles() {
    return useStyles()
}