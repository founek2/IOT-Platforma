import React from 'react';
import { Home as HomeIcon, Chair as ChairIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';


export interface EditModeDialogProps {
    open: boolean;
    onClose: (value: 'rooms' | 'buildings' | undefined) => void;
}

export function EditModeDialog({ open, onClose }: EditModeDialogProps) {
    return (
        <Dialog onClose={() => onClose(undefined)} open={open}>
            <DialogTitle>Zvolte co budete uspořádávat</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem button onClick={() => onClose('rooms')}>
                    <ListItemIcon>
                        <ChairIcon />
                    </ListItemIcon>
                    <ListItemText primary="Místnosti" />
                </ListItem>
                <ListItem button onClick={() => onClose('buildings')}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Budovy" />
                </ListItem>
            </List>
        </Dialog>
    );
}
