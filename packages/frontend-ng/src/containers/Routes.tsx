import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { Authorization } from '../Pages/Authorization';
import { HomePage } from '../Pages/Home';
import { privileges } from '../services/privileges';
import { getCurrentGroups } from '../selectors/getters';
import uiMessages from 'common/src/localization/uiMessages';

export default function MyRoutes() {
    const userGroups = useAppSelector(getCurrentGroups);

    return (
        <Routes>
            {privileges.getPathsWithComp(userGroups).map(({ path, Component, name }) => (
                <Route
                    path={path}
                    key={path}
                    element={<Component title={name ? uiMessages.getMessage(name) : undefined} />}
                />
            ))}
            <Route path="/authorization/*" element={<Authorization />} />
            <Route path="/*" element={<HomePage />} />
        </Routes>
    );
}
