import { Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ChairIcon from '@mui/icons-material/Chair';

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
