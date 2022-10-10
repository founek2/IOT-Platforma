import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { ListSubheader, useMediaQuery, useTheme } from '@mui/material';
import LoginDialog from './LoginDialog';
import { useAppSelector } from '../hooks';
import { isLoggedIn } from '../utils/getters';

function createList(closeDrawer: (event: React.KeyboardEvent | React.MouseEvent) => void) {
    return (
        <Box sx={{ width: 250 }} role="presentation" onClick={closeDrawer} onKeyDown={closeDrawer}>
            <List
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Menu
                    </ListSubheader>
                }
            >
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export function MenuAppBar() {
    const theme = useTheme();
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
                            {isDesktop ? 'IoT Domu' : 'Domu'}
                        </Typography>
                        <Button onClick={() => setLoginOpen(true)} color="inherit">
                            {isUserLoggedIn ? 'Přihlášen' : 'Login'}
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <SwipeableDrawer anchor="left" open={isMenuOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
                {createList(toggleDrawer(false))}
            </SwipeableDrawer>
            <LoginDialog open={isLoginOpen && !isUserLoggedIn} onClose={() => setLoginOpen(false)} />
        </>
    );
}
