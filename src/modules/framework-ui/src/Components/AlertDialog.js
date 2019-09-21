
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loader from 'framework-ui/src/Components/Loader'

function AlertDialog({ onAgree, onClose, open, title, content, cancelText = "Zrušit", agreeText = "Souhlasím", notDisablePending = false }) {
    const [pending, setPending] = useState(false)
    async function handleAgree(e) {
        setPending(true)
        await onAgree(e)
        if (!notDisablePending) setPending(false)
    }
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {cancelText}
                </Button>
                <Button onClick={handleAgree} color="primary" autoFocus disabled={pending}>
                    {agreeText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}


export default AlertDialog;
