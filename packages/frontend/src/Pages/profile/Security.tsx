import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function Security() {
    const classes = useStyles();
    // const { data, loading } = useGetUserLoginsQuery()
    const loading = true;

    return (
        <div>
            {loading && 'Není implementováno...'}
            {/* {!loading && <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <caption>Zobrazeno posledních 15 přihlášení</caption>
                    <TableHead>
                        <TableRow>
                            <TableCell>Datum</TableCell>
                            <TableCell align="right">Neúspěšné pokusy</TableCell>
                            <TableCell align="right">Ip adresa</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.user?.logins?.map(({ id, attemptsCounter, createdAt, ipAddress }) => (
                            <TableRow key={id}>
                                <TableCell component="th" scope="row">
                                    {format(new Date(createdAt), 'd. M. H:mm')}
                                </TableCell>
                                <TableCell align="right">{attemptsCounter}</TableCell>
                                <TableCell align="right">{ipAddress}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>} */}
        </div>
    );
}

export default Security;
