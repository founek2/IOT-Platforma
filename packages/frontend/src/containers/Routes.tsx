import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { Authorization } from '../Pages/Authorization';
import { HomePage } from '../Pages/Home';
import { privileges } from '../services/privileges';
import { getCurrentGroups } from '../selectors/getters';
import uiMessages from 'common/src/localization/uiMessages';
import Registration from '../Pages/Registration';
import { preserveLocation } from '../utils/preserveLocation';

preserveLocation();

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
            <Route path="/registration" element={<Registration />} />
            <Route path="/*" element={<HomePage />} />
        </Routes>
    );
}
