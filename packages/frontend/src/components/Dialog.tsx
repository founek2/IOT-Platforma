import React from 'react';
import DialogMui from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Menu, MenuItem, SxProps, Theme } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface DialogProps {
    open: boolean;
    title?: string;
    onClose: () => any;
    onAgree?: () => any;
    onDisagree?: () => any;
    onMenuItem?: () => any;
    agreeText?: string;
    disagreeText?: string;
    children?: JSX.Element | null;
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
    disabled?: boolean;
}
export function Dialog({
    open,
    onClose,
    onDisagree,
    onAgree,
    title,
    agreeText = 'Souhlasím',
    disagreeText,
    children,
    sx,
    fullWidth,
    disabled,
    onMenuItem,
}: DialogProps) {
    const isSmall = useMediaQuery('(max-width:450px)');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <DialogMui open={open} onClose={onClose} fullScreen={isSmall} sx={sx} fullWidth={fullWidth}>
            <DialogTitle id="alert-dialog-title" display="flex">
                {title ? title : null}
                <Box flexGrow={1} />
                {onMenuItem ? <>
                    <IconButton
                        aria-label="close"
                        onClick={handleClick}
                        sx={{
                            right: (theme) => theme.spacing(-2),
                        }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => {
                            onMenuItem()
                            handleCloseMenu()
                        }}>Uspořádat</MenuItem>
                    </Menu></> : null}
                {isSmall ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            right: (theme) => theme.spacing(-2),
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                {disagreeText ? (
                    <Button onClick={onDisagree || onClose} color="secondary" disabled={disabled}>
                        {disagreeText}
                    </Button>
                ) : null}
                {onAgree ? (
                    <Button onClick={onAgree} autoFocus disabled={disabled}>
                        {agreeText ? agreeText : null}
                    </Button>
                ) : null}
            </DialogActions>
        </DialogMui>
    );
}
