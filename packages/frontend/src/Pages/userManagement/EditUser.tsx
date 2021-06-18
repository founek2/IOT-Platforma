import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import { IUser } from 'common/lib/models/interface/userInterface';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import Loader from 'framework-ui/lib/Components/Loader';
import { getAllowedGroups } from 'framework-ui/lib/privileges';
import { formsDataActions } from 'framework-ui/lib/redux/actions/formsData';
import { getGroups } from 'framework-ui/lib/utils/getters';
import { map, pick } from 'ramda';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserForm from '../../components/UserForm';
import { RootState } from 'frontend/src/store/store';

const useStyles = makeStyles((theme) => ({
    card: {
        overflow: 'auto',
        margin: '0px auto',
        position: 'relative',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 470,
        marginTop: 0,

        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
    actions: {
        marginBottom: theme.spacing(2),
        // [theme.breakpoints.up('sm')]: {
        //      marginTop: theme.spacing.unit * 2,
        // },
        margin: 'auto',
        width: 400,
        justifyContent: 'center',

        [theme.breakpoints.down('sm')]: {
            width: '100%',
            justifyContent: 'flex-start',
            flexDirection: 'column',
        },
    },
    header: {
        paddingBottom: 0,
        paddingTop: theme.spacing(4),
        textAlign: 'center',
    },
    content: {
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    },
    chipArray: {
        maxHeight: 120,
    },
}));

interface EditUserProps {
    user: IUser;
    onButtonClick: () => void | Promise<void>;
}
function EditUser({ user, onButtonClick }: EditUserProps) {
    const [pending, setPending] = useState(false);
    const groups = useSelector<RootState, IUser['groups']>(getGroups as any);
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        const userObj = pick(['info', 'groups', 'auth'], user);
        dispatch(formsDataActions.setFormData({ formName: 'EDIT_USER', data: userObj }));
    }, [dispatch]);

    async function handleSave() {
        setPending(true);
        await onButtonClick();
        setPending(false);
    }
    return (
        <Card className={classes.card}>
            <CardHeader className={classes.header} title="Editace uživatele" />
            <CardContent className={classes.content}>
                <UserForm formName="EDIT_USER" />
                <FieldConnector
                    deepPath="EDIT_USER.groups"
                    component="ChipArray"
                    optionsData={map(({ name, text }) => ({ value: name, label: text }), getAllowedGroups(groups))}
                    className={classes.chipArray}
                />
            </CardContent>
            <CardActions className={classes.actions}>
                <Button color="primary" variant="contained" onClick={handleSave} disabled={pending}>
                    Uložit
                </Button>
                <Loader open={pending} />
            </CardActions>
        </Card>
    );
}

export default EditUser;
