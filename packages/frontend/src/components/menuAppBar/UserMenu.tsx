import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/index.js';
import { authorizationActions } from '../../store/slices/application/authorizationActions.js';
import { preferencesActions } from '../../store/slices/preferences/setting.js';
import { getColorMode, getCurrentUserId, getCurrentUserName } from '../../selectors/getters.js';
import { useNavigate } from 'react-router-dom';
import { Button, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';

export function UserMenu() {
    const userName = useAppSelector(getCurrentUserName);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const open = Boolean(anchorEl);
    const colorMode = useAppSelector(getColorMode);
    const navigate = useNavigate();

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
    const handleEditMode = () => {
        navigate({ search: '?edit=true' });
        handleClose();
    };
    const handleEditUser = () => {
        navigate("/profile");
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
                <MenuItem onClick={handleEditUser}>Účet</MenuItem>
                <MenuItem onClick={handleEditMode}>Uspořádat</MenuItem>
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
