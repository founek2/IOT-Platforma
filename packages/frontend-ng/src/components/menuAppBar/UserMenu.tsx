import { Button, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { authorizationActions } from '../../store/slices/application/authorizationActions';
import { getCurrentUserName } from '../../utils/getters';

export function UserMenu() {
    const userName = useAppSelector(getCurrentUserName);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const open = Boolean(anchorEl);

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

    return (
        <>
            <Button onClick={handleClick} color="inherit">
                {userName}
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
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
                <MenuItem onClick={handleSignOut}>Odhlásit</MenuItem>
            </Menu>
        </>
    );
}
