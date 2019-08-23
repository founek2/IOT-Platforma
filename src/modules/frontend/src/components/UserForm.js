import React, { Fragment } from 'react';
import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import MenuItem from '@material-ui/core/MenuItem';
import { AuthTypes } from '../constants'

export const AuthTypesWithText = [{ value: AuthTypes.WEB_AUTH, text: 'web API' }]

function UserForm({formName}) {
    return (
        <Fragment>
            <FieldConnector
                fieldProps={{
                    type: 'text',
                }}
                deepPath={`${formName}.info.firstName`}
            />
            <FieldConnector
                fieldProps={{
                    type: 'text',
                }}
                deepPath={`${formName}.info.lastName`}
            />
            <FieldConnector
                fieldProps={{
                    type: 'text',
                }}
                deepPath={`${formName}.info.userName`}
            />
            <FieldConnector
                fieldProps={{
                    type: 'email',
                }}
                deepPath={`${formName}.info.email`}
            />
            <FieldConnector
                component="PasswordField"
                deepPath={`${formName}.auth.password`}
            />
            <FieldConnector
                component="Select"
                deepPath={`${formName}.auth.type`}
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
                    )
                ]}
            />
        </Fragment>)
}

export default UserForm