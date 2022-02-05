import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loader from './Loader';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    loader: {
        position: 'absolute',
    },
    agreeButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

interface AlertDialogProps {
    onAgree: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onClose: () => void;
    open: boolean;
    title: string;
    content: string | JSX.Element | JSX.Element[];
    cancelText?: string;
    agreeText?: string;
    disablePending?: boolean;
    fullScreen?: boolean;
}
function AlertDialog({
    onAgree,
    onClose,
    open,
    title,
    content,
    cancelText,
    agreeText = 'Souhlasím',
    disablePending = false,
    fullScreen,
}: AlertDialogProps) {
    const [pending, setPending] = useState(false);
    const classes = useStyles();

    async function handleAgree(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (!disablePending) setPending(true);
        await onAgree(e);
        if (!disablePending) setPending(false);
    }
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen={fullScreen}
            classes={{
                paper: classes.paper,
            }}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                {typeof content == 'string' ? (
                    <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
                ) : (
                    content
                )}
            </DialogContent>
            <DialogActions>
                {cancelText ? (
                    <Button onClick={onClose} color="primary">
                        {cancelText}
                    </Button>
                ) : null}
                <div className={classes.agreeButton}>
                    <Button onClick={handleAgree} color="primary" autoFocus disabled={pending}>
                        {agreeText}
                    </Button>
                    <Loader open={pending} className={classes.loader} />
                </div>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;
