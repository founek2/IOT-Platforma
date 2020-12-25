declare interface Config {
    port: number,
    bodyLimit: string,
    homepage: string,
    imagesPath: string,
    firebaseAdminPath: string,
    portAuth: number,
    db: {
        userName: string,
        password: string,
        name: string,
        url: string,
        port: number,
    },
    jwt: {
        privateKey: string,
        publicKey: string,
        expiresIn: string
    },
    mqtt: {
        port: number,
        userName: string,
        password: string,
    },
    testUser: string,
    testPassword: string,
}