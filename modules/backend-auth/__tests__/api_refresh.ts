import { sendSignIn, signOut } from './api_signIn';
import { server } from './helpers/superTest';
import { credentials } from './resources/credentials';
import forms from './resources/forms/refreshForm';

describe('Refresh API', function () {
    afterEach(async function () {
        await signOut(credentials.user.userName)
    })

    test('shoud refresh token', async function () {
        const { refreshToken } = await sendSignIn(credentials.user.userName, credentials.user.password)

        const res = await server
            .post('/api/auth/user/signIn/refresh')
            .send(forms.refresh_token(refreshToken))
            .expect('Content-type', /json/)
            .expect(200);

        expect(res.body.accessToken).toBeTruthy();
    });


    test('shoud fail for invalid token', async function () {
        await sendSignIn(credentials.user.userName, credentials.user.password)

        const res = await server
            .post('/api/auth/user/signIn/refresh')
            .send(forms.refresh_token("12345678"))
            .expect('Content-type', /json/)
            .expect(401);

        expect(res.body).toEqual({ error: 'invalidToken' });
    });

    test('shoud fail for access token', async function () {
        const { accessToken } = await sendSignIn(credentials.user.userName, credentials.user.password)

        const res = await server
            .post('/api/auth/user/signIn/refresh')
            .send(forms.refresh_token(accessToken))
            .expect('Content-type', /json/)
            .expect(401);

        expect(res.body).toEqual({ error: 'invalidToken' });
    });

    test('shoud fail for user id missmatch', async function () {
        await sendSignIn(credentials.user.userName, credentials.user.password)
        const validTokenWithInvalidUserId = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NWJmZjc3NjZiNzRiYjJjMTI0OTdkZTMiLCJzdWIiOiI2NWJmZjc3NjUxYmE4NjJjMTIxMDg3ODQiLCJpYXQiOjE3MDcwNzk1NDIsImF1ZCI6InJlZnJlc2hUb2tlbiJ9.TZGuFLX1WYhzfEj8QOzgqdhAlEIkU2Lg8rUk0hwsl3fEQQknGcLe6DXZqSu3JClvPPvPix2-NCtszDgEaONN-JMbals-Onn4FSW_ViGl8iSwPNuBGS85M3NeusdsFU-Szy_5oSPZvn1HcmZSD-Rim2H8H3Jo-8fpOuDJHtVEVKA_0unqwmyKotVnG-fGG8pDiMGRuRv4oUFbQ3qOORIA2XNRdl8uxhvVlRMT5qUyaRfpA9LUSMJTUlBIaA-plfnaARuQHcFUnQluRvgWEjdRWnwp5snKMxnHM4kEEozvUL1WrnQnDtQCqmSqrV6DZk4fOIyohCl7-v7wQS_tqIvBbNkynlI9ehSO0tX6Yms8Iy016jOY6cEc9mCm20kOqssUkBt5ztzgShfJlw3pZnxsA04V0R4D3ufrT5Ak7NOUtBerIix5rupP7mtPF4f2fO3wOM-ORIkTtaHeytLT4zu-Fvc6-d7H_jN0MBiXfkTHIfZF_6sBt2r-dRCQ0JFEgyqLXiLIb4dVPHQpRVcGlbg8aBTy7Lof4-fyA-5ZOqtPuMv4pEIIeatawJcny8QMk7Lhkmv8L6eCtC2Pwd3ngQaCO_mDVlVbi60WmBafohqBp0S7UVupefsSXjVAp_7jXnGwBwfj-9dKa73Jl62JK7wA_sd5JaQ5vwVkInr9ZqTwaCY";

        const res = await server
            .post('/api/auth/user/signIn/refresh')
            .send(forms.refresh_token(validTokenWithInvalidUserId))
            .expect('Content-type', /json/)
            .expect(401);

        expect(res.body).toEqual({ error: 'unknownUser' });
    });
});
