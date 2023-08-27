import React from "react"
import { Card, CircularProgress, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import DataList from '../components/DataList.js';
import { User } from '../endpoints/signIn.js';
import { useUsersQuery } from '../endpoints/users.js';

function extractHumanText(user: User) {
    let text = user.info.userName;

    if (user.groups.some((group) => group === 'admin' || group === 'root')) text += '*';

    text += ' (' + user.info.email;

    if (user.info.firstName) text += ` ${user.info.firstName}`;

    if (user.info.lastName) text += ` ${user.info.lastName}`;

    return text + ')';
}

export default function UserManagement() {
    const { isLoading, data } = useUsersQuery(undefined);
    const navigate = useNavigate()

    return isLoading ? (
        <CircularProgress />
    ) : (
        <>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={7} lg={6} xl={3}>
                    <Card sx={{ padding: 4 }}>
                        <DataList data={data || []} getHumanText={extractHumanText} onClick={(user) => navigate({ search: `?editUser=${user._id}` })} />
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
