import IconButton from '@material-ui/core/IconButton';
import { useAppDispatch } from 'frontend/src/hooks';
import React, { useEffect, useState } from 'react';
import { fetchAuthorization } from "../../api/authorization";

type AuthType = {
    provider: string;
    authUrl: string;
    iconUrl: string;
}

type AuthResponse = {
    oauth: AuthType[]
}

const emptyArray = [] as AuthType[]

function createButton({ authUrl, iconUrl, provider }: AuthType) {
    return <IconButton key={provider} onClick={() => window.open(authUrl, '_self')}>
        <img src={iconUrl} />
    </IconButton>
}

function OAuthButtons({ className }: { className?: string }) {
    const dispatch = useAppDispatch()
    const [oauth, setAuth] = useState<AuthType[]>(emptyArray)

    useEffect(() => {
        async function run() {
            fetchAuthorization({
                onSuccess: (json: AuthResponse) => setAuth(json.oauth.map(obj => ({
                    ...obj,
                    authUrl: obj.authUrl + `&redirect_uri=${window.location.origin}/authorization/redirect`
                })))
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
