import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingsRemoteIcon from '@material-ui/icons/SettingsRemote';
import { IDevice } from 'common/lib/models/interface/device';
import { IUser } from 'common/lib/models/interface/userInterface';
import { useAppSelector } from 'frontend/src/hooks';
import { getUserNames } from 'frontend/src/utils/getters';
import { map, o, prop } from 'ramda';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        maxHeight: 200,
        overflow: 'auto',
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    icon: {
        marginLeft: theme.spacing(1),
        minWidth: 24,
    },
    listHeader: {
        paddingLeft: 0,
        paddingRight: theme.spacing(1),
        height: 40,
        fontSize: 16,
        whiteSpace: 'pre',
    },
    errorColor: {
        color: '#f44336',
    },
}));

function getIcon(userId: IUser['_id'], permissions: IDevice['permissions']) {
    const isRead = permissions.read.some((id) => id === userId);
    const isControl = permissions.control.some((id) => id === userId);
    const isWrite = permissions.write.some((id) => id === userId);

    return isRead && isControl && isWrite ? (
        <SettingsIcon />
    ) : isRead && isControl ? (
        <SettingsRemoteIcon />
    ) : isRead ? (
        <MenuBookIcon />
    ) : null;
}

type UserName = {
    _id: string;
    userName: string;
};

const createListItem =
    (clickHandler: (e: any, id: IUser['_id']) => void, permissions: IDevice['permissions'], classes: any) =>
    (obj: UserName) => {
        return (
            <ListItem button onClick={(e) => clickHandler(e, obj._id)} key={obj._id}>
                <ListItemText primary={obj.userName} />
                <ListItemIcon className={classes.icon}>{getIcon(obj._id, permissions)}</ListItemIcon>
            </ListItem>
        );
    };

interface PermissionSelectProps {
    label: string;
    error: boolean;
    className?: string;
    permissions: IDevice['permissions'];
    onChange: (permissions: { target: { value: IDevice['permissions'] } }) => void;
}
function PermissionSelect({ label, error, className, permissions, onChange }: PermissionSelectProps) {
    // @ts-ignore
    permissions = permissions === '' ? { read: [], write: [], control: [] } : permissions;
    const classes = useStyles();
    const [ancholEl, setAnchorEl] = useState(null);
    const [userId, setUserId] = useState('');

    const userNames = useAppSelector(o(prop('data'), getUserNames));
    function handleClick(e: any, id: IUser['_id']) {
        setAnchorEl(e.currentTarget);
        setUserId(id);
    }
    function reset() {
        setAnchorEl(null);
        setUserId('');
    }

    function handlePermissionClick(permission?: 'read' | 'write' | 'control') {
        reset();
        let perms = {
            read: permissions.read.filter((id) => id !== userId),
            control: permissions.control.filter((id) => id !== userId),
            write: permissions.write.filter((id) => id !== userId),
        };

        if (permission === 'read') {
            perms.read = [...perms.read, userId];
        } else if (permission === 'control') {
            perms.read = [...perms.read, userId];
            perms.control = [...perms.control, userId];
        } else if (permission === 'write') {
            perms.read = [...perms.read, userId];
            perms.control = [...perms.control, userId];
            perms.write = [...perms.write, userId];
        }

        onChange({ target: { value: perms } });
    }

    const listItems = map(createListItem(handleClick, permissions, classes), userNames);

    return (
        <>
            <List
                subheader={<ListSubheader className={classes.subheader}>{label}</ListSubheader>}
                className={classes.root}
            >
                {listItems}
            </List>
            <Menu id="menu-appbar" anchorEl={ancholEl} open={Boolean(ancholEl)} onClose={reset}>
                <MenuItem onClick={() => handlePermissionClick('read')}>Čtení</MenuItem>
                <MenuItem onClick={() => handlePermissionClick('control')}>Ovládání</MenuItem>
                <MenuItem onClick={() => handlePermissionClick('write')}>Správa</MenuItem>
                <MenuItem onClick={() => handlePermissionClick()}>Žádné</MenuItem>
            </Menu>
        </>
    );
}

export default PermissionSelect;
