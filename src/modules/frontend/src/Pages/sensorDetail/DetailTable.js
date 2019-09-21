import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';


const round2 = (num) =>
    Math.round(num * 100) / 100

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
        paddingLeft: theme.spacing(2)
    }
}));

function DetailTable({ sensorRecipe: { JSONkey, name, unit }, sumObject }) {
    const classes = useStyles();
    console.log("DetailTable", name, sumObject)
    const days = Object.keys(sumObject)
    const rows = []
    days.forEach(date => {
        const { sum, nsamples: { day = 0, night = 0 }, min, max } = sumObject[date]
        const daySum = sum.day && sum.day[JSONkey]
        const nightSum = (sum.night && sum.night[JSONkey]) || 0
        rows.push(
            <TableRow key={date}>
                <TableCell component="th" scope="row">
                    {new Date(date).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">{round2(daySum / day) || ""}</TableCell>
                <TableCell align="right">{round2(nightSum / night) || ""}</TableCell>
                <TableCell align="right">{round2((nightSum + daySum) / (night + day)) || ""}</TableCell>
                <TableCell align="right">{min[JSONkey]}</TableCell>
                <TableCell align="right">{max[JSONkey]}</TableCell>
            </TableRow>
        )
    })
    return (
        <Paper className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <div className={classes.title}>
                    <Typography color="inherit" variant="subtitle1">
                        {`${name} (${unit})`}
                    </Typography>
                </div>
            </Toolbar>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Datum</TableCell>
                        <Tooltip title="Od 6h do 20h" placement="top">
                            <TableCell align="right">Den</TableCell>
                        </Tooltip>
                        <Tooltip title="Od 20h do 6h" placement="top">
                            <TableCell align="right">Noc</TableCell>
                        </Tooltip>
                        <TableCell align="right">Průměr</TableCell>
                        <TableCell align="right">Min</TableCell>
                        <TableCell align="right">Max</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default DetailTable;