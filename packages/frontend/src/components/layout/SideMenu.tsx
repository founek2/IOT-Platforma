import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import { Link, useLocation } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InfoIcon from '@material-ui/icons/Info';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getPaths } from 'framework-ui/lib/privileges';
import { isUserLoggerIn } from 'framework-ui/lib/utils/getters';
import uiMessages from '../../localization/ui';
import { useAppSelector } from 'frontend/src/hooks';
import { getGroups } from 'frontend/src/utils/getters';

const useClasses = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

function createMenuListItem(location: { pathname: string }) {
    return ({ path, name, Icon }: any) => {
        return (
            <Link to={path} key={path}>
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
    open: boolean
    onClose: () => void
    onOpen: () => void
}
function SideMenu({ open, onClose, onOpen }: SideMenuProps) {
    const userGroups = useAppSelector(getGroups)
    const userRoutes = getPaths(userGroups);
    const location = useLocation();
    const userPresence = useAppSelector(isUserLoggerIn)

    const classes = useClasses()

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
