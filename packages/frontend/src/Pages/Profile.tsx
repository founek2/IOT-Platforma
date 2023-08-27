import React from 'react';
import { Box, Breadcrumbs, Grid, Typography } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import Account from './profile/Account.js';
import AccessTokens from './profile/AcessTokens.js';
import Security from './profile/Security.js';
import { AccountCircle as AccountCircleIcon, Accessibility as AccessibilityIcon, Security as SecurityIcon } from '@mui/icons-material';

// const useStyles = makeStyles((theme) => ({
//     link: {
//         display: 'flex',
//     },
//     icon: {
//         marginRight: theme.spacing(0.5),
//         width: 20,
//         height: 20,
//     },
//     breadCrumbsOl: {
//         justifyContent: 'center',
//     },
// }));

const menu = [
    { icon: AccountCircleIcon, text: 'Účet', link: '/profile' },
    { icon: AccessibilityIcon, text: 'Přístupnost', link: '/profile/accessTokens' },
    { icon: SecurityIcon, text: 'Zabezpečení', link: '/profile/security' },
    // { icon: PersonAddIcon, text: "Vytvořit uživatele", link: "/profile/addUser", role: "ENTITY_MANAGER" }
];

function Profile() {
    return (
        <Grid container pt={2} alignItems="center" flexDirection="column" >
            <Grid item>
                <Breadcrumbs aria-label="breadcrumb">
                    {menu.map(({ icon: Icon, text, link }) => (

                        <Link to={link} key={link} className="util--flex">
                            <Box display="flex" >
                                <Icon />
                                <Typography
                                    color={location.pathname === link ? 'textPrimary' : 'inherit'}
                                >
                                    {text}
                                </Typography>
                            </Box>
                        </Link>

                    ))}
                </Breadcrumbs>
            </Grid>
            <Grid item pt={3}>
                <Routes>
                    <Route element={<Security />} path="security" />
                    <Route element={<AccessTokens />} path="accessTokens" />
                    <Route element={<Account />} path="/" />
                </Routes>
            </Grid>

        </Grid>
    );
}

export default Profile;
