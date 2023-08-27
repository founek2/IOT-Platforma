import React from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import { useMediaQuery, type SxProps, type Theme, DialogTitle, IconButton, DialogContent, DialogActions, Button, Dialog as DialogMui } from '@mui/material';

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
