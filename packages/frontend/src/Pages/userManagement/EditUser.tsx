import React, { Component, useEffect, useState } from 'react';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import UserForm from '../../components/UserForm';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Loader from 'framework-ui/lib/Components/Loader';
import { map, pick } from 'ramda';

import { getGroups } from 'framework-ui/lib/utils/getters';
import { getAllowedGroups } from 'framework-ui/lib/privileges';
import * as formsActions from 'framework-ui/lib/redux/actions/formsData';
import { IUser } from 'common/lib/models/interface/userInterface';
import { IState } from 'frontend/src/types';

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
    fillEditFormAction: any;
    user: IUser;
    onButtonClick: () => void | Promise<void>;
}
function EditUser({ fillEditFormAction, user, onButtonClick }: EditUserProps) {
    const [pending, setPending] = useState(false);
    const groups = useSelector<IState, IUser['groups']>(getGroups as any);
    const classes = useStyles();

    useEffect(() => {
        const userObj = pick(['info', 'groups', 'auth'], user);
        fillEditFormAction(userObj);
    });

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

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            fillEditFormAction: formsActions.fillForm('EDIT_USER'),
        },
        dispatch
    );

export default connect(null, _mapDispatchToProps)(EditUser);
