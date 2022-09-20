import Grid from '@material-ui/core/Grid';
import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import { getAllowedGroups } from 'framework-ui/src/privileges';
import { map } from 'ramda';
import React from 'react';
import { useAppSelector } from 'src/hooks';
import { getGroups } from 'src/utils/getters';

interface UserFormProps {
    formName: string;
    onEnter?: React.EventHandler<any>;
    editGroups?: boolean;
}
function UserForm({ formName, onEnter, editGroups }: UserFormProps) {
    const groups = useAppSelector(getGroups);

    return (
        <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
                <FieldConnector
                    deepPath={`${formName}.info.firstName`}
                    fieldProps={{
                        fullWidth: true,
                    }}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <FieldConnector
                    deepPath={`${formName}.info.lastName`}
                    fieldProps={{
                        fullWidth: true,
                    }}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <FieldConnector
                    deepPath={`${formName}.info.userName`}
                    fieldProps={{
                        fullWidth: true,
                    }}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <FieldConnector
                    fieldProps={{
                        type: 'email',
                        fullWidth: true,
                    }}
                    deepPath={`${formName}.info.email`}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <FieldConnector
                    component="PasswordField"
                    deepPath={`${formName}.auth.password`}
                    onEnter={onEnter}
                    fieldProps={{
                        fullWidth: true,
                    }}
                />
            </Grid>
            {editGroups ? (
                <Grid item>
                    <FieldConnector
                        deepPath={`${formName}.groups`}
                        component="ChipArray"
                        optionsData={map(({ name, text }) => ({ value: name, label: text }), getAllowedGroups(groups))}
                        // className={classes.chipArray}
                    />
                </Grid>
            ) : null}
        </Grid>
    );
}

export default UserForm;
