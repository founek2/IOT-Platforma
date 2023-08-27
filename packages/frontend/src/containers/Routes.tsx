import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/index.js';
import { Authorization } from '../Pages/Authorization.js';
import { HomePage } from '../Pages/Home.js';
import { privileges } from '../services/privileges.js';
import { getCurrentGroups } from '../selectors/getters.js';
import uiMessages from 'common/src/localization/uiMessages.js';
import Registration from '../Pages/Registration.js';
import { preserveLocation } from '../utils/preserveLocation.js';

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
