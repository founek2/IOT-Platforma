import React from 'react';
import DialogMui from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import type { SxProps, Theme } from '@mui/material';

export interface DialogProps {
    open: boolean;
    title?: string;
    onClose: () => any;
    onAgree?: () => any;
    onDisagree?: () => any;
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
}: DialogProps) {
    const isSmall = useMediaQuery('(max-width:450px)');

    return (
        <DialogMui open={open} onClose={onClose} fullScreen={isSmall} sx={sx} fullWidth={fullWidth}>
            <DialogTitle id="alert-dialog-title">
                {title ? title : null}
                {isSmall ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
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
