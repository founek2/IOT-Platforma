import { Card, CardContent, CardHeader, Grid, Paper, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import { useGetActiveSignInQuery } from '../../endpoints/signIn';

function Security() {
    const { data, isLoading } = useGetActiveSignInQuery()

    return (
        <Grid container maxWidth={600} spacing={1}>
            {data?.map((t) => {
                const createdAt = new Date(t.createdAt)
                const title = t.userAgent ? `${t.userAgent.device.vendor} ${t.userAgent.device.model}, ${t.userAgent.os.name} ${t.userAgent.os.version}, ${t.userAgent.browser.name} ${t.userAgent.browser.version}` : "Neznámé zařízení";
                return <Grid item xs={12} key={t._id}>
                    <Paper sx={{ p: 2 }}>
                        <Typography fontWeight={500}>{title}</Typography>
                        <Typography variant='body2' color={grey[500]}>{createdAt.toLocaleDateString()}, {createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Typography>
                        {/* <CardHeader title={title} />
                        <CardContent>
                            <Typography>{createdAt.toLocaleDateString()}, {createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Typography>
                        </CardContent> */}
                    </Paper>
                </Grid>
            })}

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
        </Grid>
    );
}

export default Security;
