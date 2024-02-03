import { UserModel } from 'common';
import { server } from './helpers/superTest';
import { credentials } from './resources/credentials';
import forms from './resources/forms/userForms';

describe('SignOut API', function () {
    test('shoud signOut user', async function () {
        const { body: { accessToken } } = await server
            .post('/api/auth/user/signIn')
            .send(forms.login(credentials.user.userName, credentials.user.password))
            .expect(200);

        await server
            .post('/api/auth/user/signOut')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
            .expect(204);

        const user = await UserModel.findByUserName(credentials.user.userName);
        expect(user!.refreshTokens).toHaveLength(1);
        expect(user!.refreshTokens![0].validTo?.getTime()).toBeLessThan(Date.now())
    });
});
