import { Grid } from '@mui/material';
import React from 'react';
import { useAppSelector } from 'src/hooks';
import { getCurrentGroups } from '../selectors/getters';
import FieldConnector from './FieldConnector';

interface UserFormProps {
    formName: 'REGISTRATION';
    onEnter?: React.EventHandler<any>;
    editGroups?: boolean;
}
function EditUserForm({ formName, onEnter, editGroups }: UserFormProps) {
    const groups = useAppSelector(getCurrentGroups);

    return (
        <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
                <FieldConnector deepPath={`${formName}.info.firstName`} fullWidth />
            </Grid>
            <Grid item md={6} xs={12}>
                <FieldConnector deepPath={`${formName}.info.lastName`} fullWidth />
            </Grid>
            <Grid item md={6} xs={12}>
                <FieldConnector deepPath={`${formName}.info.userName`} fullWidth />
            </Grid>
            <Grid item md={6} xs={12}>
                <FieldConnector
                    fieldProps={{
                        type: 'email',
                    }}
                    fullWidth
                    deepPath={`${formName}.info.email`}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <FieldConnector
                    component="PasswordField"
                    deepPath={`${formName}.auth.password`}
                    onEnter={onEnter}
                    fullWidth
                />
            </Grid>
            {/* {editGroups ? (
                <Grid item>
                    <FieldConnector
                        deepPath={`${formName}.groups`}
                        component="ChipArray"
                        optionsData={map(({ name, text }) => ({ value: name, label: text }), getAllowedGroups(groups))}
                        // className={classes.chipArray}
                    />
                </Grid>
            ) : null} */}
        </Grid>
    );
}

export default EditUserForm;
