import Grid from '@material-ui/core/Grid';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import React from 'react';

interface UserFormProps {
    formName: string;
    onEnter?: React.EventHandler<any>;
}
function UserForm({ formName, onEnter }: UserFormProps) {
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
        </Grid>
    );
}

export default UserForm;
