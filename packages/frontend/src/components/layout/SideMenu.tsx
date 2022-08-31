import { Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InfoIcon from '@material-ui/icons/Info';
import { getMenuPaths } from 'framework-ui/src/privileges';
import { useAppSelector } from 'frontend/src/hooks';
import { getGroups } from 'frontend/src/utils/getters';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import uiMessages from '../../localization/ui';

const useClasses = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

function externalRedirect(path: string) {
    return (e: any) => {
        if (!path.startsWith('http')) return;

        e.preventDefault();
        window.open(path, '_blank');
    };
}

function createMenuListItem(location: { pathname: string }) {
    return ({ path, name, Icon }: any) => {
        return (
            <Link to={path} key={path} onClick={externalRedirect(path)}>
                <ListItem button selected={location.pathname === path}>
                    <ListItemIcon>
                        <Icon />
                    </ListItemIcon>
                    <ListItemText primary={uiMessages.getMessage(name)} />
                </ListItem>
            </Link>
        );
    };
}

interface SideMenuProps {
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
}
function SideMenu({ open, onClose, onOpen }: SideMenuProps) {
    const userGroups = useAppSelector(getGroups);
    const userRoutes = getMenuPaths(userGroups);
    const location = useLocation();

    const classes = useClasses();

    return (
        <SwipeableDrawer open={open} onClose={onClose} onOpen={onOpen}>
            <div tabIndex={0} role="button" onClick={onClose} onKeyDown={onClose}>
                <div className={classes.list}>
                    <List>
                        <ListSubheader>Menu</ListSubheader>
                        {[...userRoutes, { path: '/', name: 'about', Icon: InfoIcon }].map(
                            createMenuListItem(location)
                        )}
                    </List>
                    <Divider />
                    <List>
                        {[{ path: '/registerUser', name: 'registration', Icon: AccountCircle }].map(
                            createMenuListItem(location)
                        )}
                    </List>
                </div>
            </div>
        </SwipeableDrawer>
    );
}

export default SideMenu;
