import React, { Fragment } from 'react';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import MenuItem from '@material-ui/core/MenuItem';
import { AuthTypes } from 'common/lib/constants';
import Grid from '@material-ui/core/Grid';

export const AuthTypesWithText = [{ value: AuthTypes.WEB_AUTH, text: 'web API' }];

interface UserFormProps {
    formName: string;
    onAuthChange?: (event: React.ChangeEvent<{ value: any }>) => void;
}
function UserForm({ formName, onAuthChange }: UserFormProps) {
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
                    fieldProps={{
                        fullWidth: true,
                    }}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <FieldConnector
                    component="Select"
                    deepPath={`${formName}.auth.type`}
                    onChange={onAuthChange}
                    fieldProps={{
                        fullWidth: true,
                    }}
                    selectOptions={[
                        <MenuItem value="" key="enum">
                            <em />
                        </MenuItem>,
                        ...AuthTypesWithText.map(
                            ({ value, text }) =>
                                value !== 'passwd' && (
                                    <MenuItem value={value} key={value}>
                                        {text}
                                    </MenuItem>
                                )
                        ),
                    ]}
                />
            </Grid>
        </Grid>
    );
}

export default UserForm;
