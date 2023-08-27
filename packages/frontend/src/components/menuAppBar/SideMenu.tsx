import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import uiMessages, { UiMessageKey } from 'common/src/localization/uiMessages.js';
import { RouteMenu } from 'common/src/privileges';
import React from 'react';
import { Link, Location, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/index.js';
import { getCurrentGroups } from '../../selectors/getters.js';
import { privileges } from '../../services/privileges.js';
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, SwipeableDrawer } from '@mui/material';

function externalRedirect(path: string) {
    return (e: any) => {
        if (!path.startsWith('http')) return;

        e.preventDefault();
        window.open(path, '_blank');
    };
}

function createMenuListItem({ path, name, Icon }: RouteMenu, location: Location) {
    return (
        <Link to={path} key={path} onClick={externalRedirect(path)}>
            <ListItem disablePadding>
                <ListItemButton selected={location.pathname === path}>
                    <ListItemIcon>
                        <Icon />
                    </ListItemIcon>
                    <ListItemText primary={uiMessages.getMessage(name)} />
                </ListItemButton>
            </ListItem>
        </Link>
    );
}

export interface SideMenuProps {
    open: boolean;
    onClose: (event: React.KeyboardEvent | React.MouseEvent) => any;
    onOpen: (event: React.KeyboardEvent | React.MouseEvent) => any;
}
export function SideMenu({ open, onClose, onOpen }: SideMenuProps) {
    const userGroups = useAppSelector(getCurrentGroups);
    const location = useLocation();

    return (
        <SwipeableDrawer anchor="left" open={open} onClose={onClose} onOpen={onOpen}>
            <Box sx={{ width: 250 }} role="presentation" onClick={onClose} onKeyDown={onClose}>
                <List
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Menu
                        </ListSubheader>
                    }
                >
                    {privileges.getMenuPaths(userGroups).map((item) => createMenuListItem(item, location))}
                </List>
                <Divider />
                <List>
                    {[{ path: '/registration', name: 'registration' as UiMessageKey, Icon: AccountCircleIcon }].map(
                        (item) => createMenuListItem(item, location)
                    )}
                </List>
            </Box>
        </SwipeableDrawer>
    );
}
