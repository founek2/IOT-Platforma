
import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import toDateTime from '../../../../utils/toDateTime'

function ControlDetail({ data, open, handleClose, ackTime, name }) {
    if (!data) return null;

    const { state, updatedAt, inTransition, transitionStarted, transitionEnded } = data;
    const transitionTime = transitionStarted && transitionEnded
        ? (new Date(transitionEnded) - new Date(transitionStarted)) / 1000
        : "?"
    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Prvek: {name}
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    Stav: {JSON.stringify(state)}<br />
                    Změna: {toDateTime(updatedAt)}<br />
                    Aktivní: {toDateTime(ackTime)}<br />
                    V přechodu: {inTransition ? "ano" : "ne"}<br />
                    Doba přechodu: {transitionTime ? transitionTime + " sec" : ""}
                </Typography>
            </DialogContent>
        </Dialog>)
}

export default ControlDetail