import {
    Divider,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    SwipeableDrawer,
} from '@mui/material';
import { RouteMenu } from 'framework-ui/src/privileges';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { privileges } from '../../services/privileges';
import { getCurrentGroups } from '../../utils/getters';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import uiMessages from 'common/src/localization/uiMessages';

function externalRedirect(path: string) {
    return (e: any) => {
        if (!path.startsWith('http')) return;

        e.preventDefault();
        window.open(path, '_blank');
    };
}

function createMenuListItem({ path, name, Icon }: RouteMenu) {
    return (
        <Link to={path} key={path} onClick={externalRedirect(path)}>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <Icon />
                    </ListItemIcon>
                    <ListItemText primary={uiMessages.getMessage(name as any)} />
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
                    {privileges.getMenuPaths(userGroups).map(createMenuListItem)}
                </List>
                <Divider />
                <List>
                    {[{ path: '/registerUser', name: 'registration', Icon: AccountCircleIcon }].map(createMenuListItem)}
                </List>
            </Box>
        </SwipeableDrawer>
    );
}
