import { UserModel } from 'common';
import { sendSignIn, signOut } from './api_signIn';
import { server } from './helpers/superTest';
import { credentials } from './resources/credentials';
import forms from './resources/forms/refreshForm';

describe('Refresh API', function () {
    test('shoud refresh token', async function () {
        const { refreshToken } = await sendSignIn(credentials.user.userName, credentials.user.password)

        const res = await server
            .post('/api/auth/user/signIn/refresh')
            .send(forms.refresh_token(refreshToken))
            .expect('Content-type', /json/)
            .expect(200);

        expect(res.body.accessToken).toBeTruthy();
        await signOut(credentials.user.userName)
    });
});
