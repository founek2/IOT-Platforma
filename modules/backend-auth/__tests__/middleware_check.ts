import { formDataMiddlewareIsPresent, tokenMiddlewareIsPresent } from "common/__test__/helpers/middlewareChecker"

test('ActiveSignIn middlewares', async function () {
    await tokenMiddlewareIsPresent('/api/auth/user/signIn/active', [
        "index"
    ])
});

test('refreshToken middleware', async function () {
    await formDataMiddlewareIsPresent("/api/auth/user/signIn/refresh", ["create"])
});

test('signIn middleware', async function () {
    await tokenMiddlewareIsPresent('/api/auth/user/signIn/123', [
        "delete"
    ])
});

test('signOut middleware', async function () {
    await tokenMiddlewareIsPresent('/api/auth/user/signOut', [
        "create"
    ])
});