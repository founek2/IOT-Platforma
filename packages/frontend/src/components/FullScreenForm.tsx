import React, { useState } from 'react';
import FullScreenDialog from 'framework-ui/src/Components/FullScreenDialog';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Loader from 'framework-ui/src/Components/Loader';

interface FullScreenFormProps {
    children: JSX.Element | JSX.Element[];
    heading: string;
    onClose: () => any;
    onAgree: () => any;
    open: boolean;
}

export default function FullScreenForm({ children, heading, onClose, open, onAgree }: FullScreenFormProps) {
    const [pending, setPending] = useState(false);

    async function handleSave() {
        setPending(true);
        await onAgree();
        setPending(false);
    }

    return (
        <FullScreenDialog open={open} onClose={onClose} heading="Editace uživatele">
            <Card>
                <CardContent>
                    <Grid container>{children}</Grid>
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={handleSave} disabled={pending}>
                        Uložit
                    </Button>
                    <Loader open={pending} />
                </CardActions>
            </Card>
        </FullScreenDialog>
    );
}
