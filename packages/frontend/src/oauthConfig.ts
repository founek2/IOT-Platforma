const authEndpoint = 'https://login.szn.cz/api/v1/oauth/auth';

const scopes = ['identity'];

export const getAuthorizeHref = (): string | null => {
    const clientId = process.env.REACT_APP_OAUTH_SEZNAM_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_OATUH_REDIRECT_URI;
    return clientId && redirectUri
        ? `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              '%20'
          )}&response_type=code`
        : null;
};
