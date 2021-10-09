import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InfoIcon from '@material-ui/icons/Info';
import { getPaths } from 'framework-ui/lib/privileges';
import { isUserLoggerIn, getAuthorization } from 'framework-ui/lib/utils/getters';
import { useAppSelector, useAppDispatch } from 'frontend/src/hooks';
import { getGroups } from 'frontend/src/utils/getters';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import uiMessages from '../../localization/ui';
import { fetchAuthorization } from "../../api/authorization"

type AuthType = {
    provider: string;
    authUrl: string;
    iconUrl: string;
}

type AuthResponse = {
    oauth: AuthType[]
}

const emptyArray = [] as AuthType[]

function createButton({ authUrl, iconUrl }: AuthType) {
    return <IconButton onClick={() => window.open(authUrl, '_self')}>
        <img src={iconUrl} />
    </IconButton>
}

function OAuthButtons({ className }: { className?: string }) {
    const dispatch = useAppDispatch()
    const [oauth, setAuth] = useState<AuthType[]>(emptyArray)

    useEffect(() => {
        async function run() {
            fetchAuthorization({
                onSuccess: (json: AuthResponse) => setAuth(json.oauth)
            }, dispatch)
        }
        run()
    }, [setAuth, dispatch])

    return oauth.length ? (
        <div className={className}>
            {oauth.map(createButton)}
        </div>
    ) : null;
}

export default OAuthButtons;
