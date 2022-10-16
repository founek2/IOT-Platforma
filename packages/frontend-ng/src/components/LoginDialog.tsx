import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthType } from 'common/src/constants';
import { getFieldVal } from 'common/src/utils/getters';
import * as React from 'react';
import { useAppSelector } from '../hooks';
import { useForm } from '../hooks/useForm';
import { useGetAuthProvidersQuery, useLazyGetAuthTypesQuery, useSignInMutation } from '../services/signIn';
import { head } from '../utils/ramda';
import FieldConnector from './FieldConnector';
import AuthProviderButtons from './loginDialog/AuthProviderButtons';
import useTheme from '@mui/material/styles/useTheme';

interface LoginForm {
    userName: string;
    password: string;
    authType: string;
}

let timer: NodeJS.Timeout;
function onStopTyping(callback: () => void) {
    clearTimeout(timer);
    timer = setTimeout(callback, 400);
}

interface LoginDialogProps {
    open: boolean;
    onClose: () => void;
}
export default function LoginDialog({ onClose, open }: LoginDialogProps) {
    const theme = useTheme();
    const { data: dataProviders } = useGetAuthProvidersQuery();
    const { validateField, validateForm, setFieldValue, resetForm } = useForm<LoginForm>('LOGIN');
    const [getAuthTypes, { isLoading: isLoadingAuthTypes, data: authTypesData, error, isError }] =
        useLazyGetAuthTypesQuery();
    const [signIn, { isLoading: isLoadingSignIn }] = useSignInMutation();
    const authTypeSelected = useAppSelector(getFieldVal('LOGIN.authType'));

    function handleNext() {
        const { value, valid } = validateField(['userName']);
        if (valid) getAuthTypes(value);
    }

    function handleSignIn() {
        const { valid, data } = validateForm();
        if (valid) {
            signIn(data).unwrap().then(handleClose).then(resetForm);
        }
    }
    function handleClose() {
        onClose();
        resetForm();
    }

    return (
        <Dialog
            open={open}
            // keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{
                sx: {
                    overflowY: 'visible',
                    [theme.breakpoints.up('lg')]: {
                        width: 500,
                    },
                    [theme.breakpoints.up('md')]: {
                        width: 400,
                    },
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    top: -20,
                    position: 'absolute',
                }}
            >
                {dataProviders?.oauth ? <AuthProviderButtons providers={dataProviders.oauth} /> : null}
            </Box>
            <DialogTitle align="center" mt={7}>
                {'Přihlášení'}
            </DialogTitle>
            <DialogContent
                sx={(theme) => ({
                    [theme.breakpoints.up('sm')]: {
                        pl: 7,
                        pr: 7,
                    },
                })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FieldConnector
                            autoFocus
                            deepPath="LOGIN.userName"
                            fullWidth
                            onChange={(e) =>
                                onStopTyping(async () => {
                                    const res = await getAuthTypes(e.target.value);
                                    const type = head(res.data?.authTypes || []);
                                    if (type) setFieldValue(type, ['authType']);
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FieldConnector
                            autoFocus
                            deepPath="LOGIN.password"
                            fieldProps={{ type: 'password' }}
                            fullWidth
                            sx={authTypeSelected === AuthType.passwd ? undefined : { display: 'none' }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                {!authTypesData?.authTypes.length ? (
                    isLoadingAuthTypes || isLoadingSignIn ? (
                        <CircularProgress />
                    ) : (
                        <Button onClick={handleNext}>Další</Button>
                    )
                ) : (
                    <Button onClick={handleSignIn}>Přihlásit</Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
