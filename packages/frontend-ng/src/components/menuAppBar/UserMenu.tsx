import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Button, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { authorizationActions } from '../../store/slices/application/authorizationActions';
import { preferencesActions } from '../../store/slices/preferences/setting';
import { getColorMode, getCurrentUserName } from '../../utils/getters';

export function UserMenu() {
    const userName = useAppSelector(getCurrentUserName);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const open = Boolean(anchorEl);
    const colorMode = useAppSelector(getColorMode);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSignOut = () => {
        dispatch(authorizationActions.signOut());
        handleClose();
    };
    const handleColorModeChange = () => {
        dispatch(preferencesActions.setColorMode(colorMode === 'light' ? 'dark' : 'light'));
        handleClose();
    };

    return (
        <>
            <Button onClick={handleClick} color="inherit">
                {userName}
            </Button>
            <Menu
                id="user-positioned-menu"
                aria-labelledby="user-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleClose}>Účet</MenuItem>
                <MenuItem onClick={handleColorModeChange}>
                    <Typography>{colorMode === 'light' ? 'Tmavý' : 'Světlý'}</Typography>
                    <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                        {colorMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Odhlásit</MenuItem>
            </Menu>
        </>
    );
}
