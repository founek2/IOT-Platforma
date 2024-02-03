const refresh_token = (refreshToken: string) => ({
    formData: {
        REFRESH_TOKEN: {
            token: refreshToken
        },
    },
});

export default {
    refresh_token
}