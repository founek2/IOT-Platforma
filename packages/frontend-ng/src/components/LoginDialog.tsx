import { CircularProgress, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { AuthType } from 'common/src/constants';
import * as React from 'react';
import { useLazyGetAuthTypesQuery, useSignInMutation } from '../services/signIn';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="down" ref={ref} {...props} />;
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
                    id="username"
                    name="username"
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

                <TextField
                    autoFocus
                    id="password"
                    name="password"
                    label="Heslo"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ display: data?.authTypes.includes(AuthType.passwd) ? 'initial' : 'none' }}
                />
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
