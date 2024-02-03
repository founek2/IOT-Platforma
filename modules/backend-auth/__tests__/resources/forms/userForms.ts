const login = (userName: string, passwd: string) => ({
    formData: { LOGIN: { userName: userName, authType: 'passwd', password: passwd } },
});

export default {
    login,
};
