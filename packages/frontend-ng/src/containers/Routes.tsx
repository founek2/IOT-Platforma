import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { Authorization } from '../Pages/Authorization';
import { HomePage } from '../Pages/Home';
import { privileges } from '../services/privileges';
import { getCurrentGroups } from '../selectors/getters';
import uiMessages from 'common/src/localization/uiMessages';
import Registration from '../Pages/Registration';
import { logger } from 'common/src/logger';

// Listen for all location changes (including back and forward)
(() => {
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
        //@ts-ignore
        let ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };

    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        //@ts-ignore
        let ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };

    window.addEventListener('popstate', function () {
        window.dispatchEvent(new Event('locationchange'));
    });
})();

// redirect to last location when /
if (!window.location.search && window.location.pathname === '/') {
    try {
        const text = localStorage.getItem('location');
        if (text) {
            const prevLocation: Location = JSON.parse(text);
            window.location.href = `${window.location.origin}${prevLocation.pathname}${prevLocation.search}`;
        }
    } catch (err) {
        logger.error('failed to load prev history', err);
    }
}

function listener() {
    const location: Location = { pathname: window.location.pathname, search: window.location.search };
    localStorage.setItem('location', JSON.stringify(location));
}
window.addEventListener('locationchange', listener);

type Location = { pathname: string; search: string };

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
