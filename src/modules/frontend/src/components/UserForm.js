import React, { Fragment } from 'react';
import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import MenuItem from '@material-ui/core/MenuItem';
import { AuthTypes } from '../constants'

export const AuthTypesWithText = [{ value: AuthTypes.WEB_AUTH, text: 'web API' }]

function UserForm({formName, onAuthChange}) {
    return (
        <Fragment>
            <FieldConnector
                deepPath={`${formName}.info.firstName`}
            />
            <FieldConnector
                deepPath={`${formName}.info.lastName`}
            />
            <FieldConnector
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
                onChange={onAuthChange}
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