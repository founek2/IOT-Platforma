import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { CONTROL_TYPES } from 'common/lib/constants'
import EnchancedTable from 'framework-ui/lib/Components/Table';
import toDateTime from '../../utils/toDateTime'


function onToText(val) {
    return val === 1 ? "Zap." : "Vyp."
}

function showColorBall(hash) {
    return hash ? <div style={{
        width: "20px",
        height: "20px",
        backgroundColor: hash,
        borderRadius: "40px"
    }} /> : null
}

const controlProps = {
    [CONTROL_TYPES.SWITCH]: [
        { path: 'timestamp', label: 'Datum', convertor: toDateTime },
        { path: 'on', label: 'Stav', convertor: onToText },
    ],
    [CONTROL_TYPES.ACTIVATOR]: [
        { path: 'timestamp', label: 'Datum', convertor: toDateTime },
        { path: 'on', label: 'Stav', convertor: onToText },
    ],
    [CONTROL_TYPES.RGB_SWITCH]: [
        { path: 'timestamp', label: 'Datum', convertor: toDateTime },
        { path: 'on', label: 'Stav', convertor: onToText },
        { path: 'color', label: 'Barva', convertor: showColorBall },
        { path: 'bright', label: 'Jas', convertor: (val) => val ? val + " %" : "" },
        // { path: 'type', label: 'Typ' },
    ],
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '45%',
        marginTop: theme.spacing(3),
        margin: "0 auto",
        overflowX: 'auto',
        [theme.breakpoints.down('md')]: {
            width: '100%',
        }
    },
    table: {
        minWidth: 400,
    },
    toolbar: {
        minHeight: 0,
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    headCell: {
        paddingTop: 0,
    }
}));

function DetailTable({ controlRecipe: { JSONkey, name, unit, type }, data }) {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <EnchancedTable className={classes.table}
                dataProps={controlProps[type]}
                data={data}
                toolbarHead="Záznam"
                enableSearch
                orderBy="timestamp"
                rowsPerPage={10}
                order="desc"
            />
        </Paper>
    );
}

export default DetailTable;