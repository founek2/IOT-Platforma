import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { CircularProgress, TextField } from '@mui/material';
import { useLazyGetAuthTypesQuery, useSignInMutation } from '../services/signIn';
import { AuthType } from 'common/src/constants';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

let timer: NodeJS.Timeout;
function onStopTyping(callback: () => void) {
    clearTimeout(timer);
    timer = setTimeout(callback, 800);
}

interface LoginDialogProps {
    open: boolean;
    onClose: () => void;
}
export default function LoginDialog({ onClose, open }: LoginDialogProps) {
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [getAuthTypes, { isLoading: isLoadingAuthTypes, data, error, isError }] = useLazyGetAuthTypesQuery();
    const [signIn, { isLoading: isLoadingSignIn }] = useSignInMutation();

    console.log('error', error, isError);

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{'Přihlášení'}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Let Google help apps determine location. This means sending anonymous location data to Google, even
                    when no apps are running
                </DialogContentText>
                <TextField
                    autoFocus
                    id="name"
                    label="Uživatelské jméno"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={userName}
                    onChange={(e) => {
                        setUserName(e.target.value);
                        onStopTyping(() => getAuthTypes(e.target.value));
                    }}
                />
                {data?.authTypes.includes(AuthType.passwd) ? (
                    <TextField
                        autoFocus
                        id="password"
                        label="Heslo"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                ) : null}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                {!data?.authTypes.length ? (
                    isLoadingAuthTypes || isLoadingSignIn ? (
                        <CircularProgress />
                    ) : (
                        <Button onClick={() => getAuthTypes(userName)}>Další</Button>
                    )
                ) : (
                    <Button onClick={() => signIn({ userName, password })}>Přihlásit</Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
