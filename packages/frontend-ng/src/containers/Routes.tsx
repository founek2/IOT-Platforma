import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { Authorization } from '../Pages/Authorization';
import { HomePage } from '../Pages/Home';
import { privileges } from '../services/privileges';
import { getCurrentGroups } from '../utils/getters';

export default function MyRoutes() {
    const userGroups = useAppSelector(getCurrentGroups);

    return (
        <Routes>
            {privileges.getPathsWithComp(userGroups).map(({ path, Component }) => (
                <Route path={path} key={path} element={<Component />} />
            ))}
            <Route path="/authorization/*" element={<Authorization />} />
            <Route path="/*" element={<HomePage />} />
        </Routes>
    );
}
