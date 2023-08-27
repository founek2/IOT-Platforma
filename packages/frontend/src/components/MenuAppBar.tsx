import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/index.js';
import { isLoggedIn } from '../selectors/getters.js';
import LoginDialog from './LoginDialog.js';
import { SideMenu } from './menuAppBar/SideMenu.js';
import { UserMenu } from './menuAppBar/UserMenu.js';
import { useAppBarContext } from '../hooks/useAppBarContext.js';
import { AppBar, Box, Button, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon } from "@mui/icons-material";


export function MenuAppBar() {
    const theme = useTheme();
    const {
        data: [headerText, RightIcon],
    } = useAppBarContext();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const [isMenuOpen, setMenuOpen] = React.useState(false);
    const [isLoginOpen, setLoginOpen] = React.useState(false);
    const isUserLoggedIn = useAppSelector(isLoggedIn);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setMenuOpen(open);
    };


    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            onClick={() => setMenuOpen(true)}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {headerText ? headerText : <Link to="/building">{isDesktop ? 'IoT Domu' : 'Domu'}</Link>}
                        </Typography>

                        {RightIcon ? (
                            RightIcon
                        ) : isUserLoggedIn ? (
                            <UserMenu />
                        ) : (
                            <Button onClick={() => setLoginOpen(true)} color="inherit">
                                Login
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
            <SideMenu open={isMenuOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} />
            <LoginDialog open={isLoginOpen && !isUserLoggedIn} onClose={() => setLoginOpen(false)} />
        </>
    );
}
