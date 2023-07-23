import MenuIcon from '@mui/icons-material/Menu';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { isLoggedIn } from '../selectors/getters';
import LoginDialog from './LoginDialog';
import { SideMenu } from './menuAppBar/SideMenu';
import { UserMenu } from './menuAppBar/UserMenu';
import { useAppBarContext } from '../hooks/useAppBarContext';

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
