import React from 'react';

function Security() {
    return (
        <div>
            {'Není implementováno...'}
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
