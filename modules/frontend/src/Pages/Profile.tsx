import { Box, Breadcrumbs, Grid, Typography } from '@mui/material';
import { IUser } from 'common/src/models/interface/userInterface';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, PathRouteProps, Routes, useLocation } from 'react-router-dom';
import Account from './profile/Account';
import AccessTokens from './profile/AcessTokens';
import Security from './profile/Security';
import { useAccessTokensQuery } from "../endpoints/accessTokens";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import SecurityIcon from '@mui/icons-material/Security';
import { useAppSelector } from '../hooks';
import { getCurrentUserId } from '../selectors/getters';

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
        <Grid container pt={2} alignItems="center" flexDirection="column" pl={1} pr={1} >
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
