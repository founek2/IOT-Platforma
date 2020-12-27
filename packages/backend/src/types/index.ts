export interface Config {
    port: number,
    bodyLimit: string,
    homepage: string,
    imagesPath: string,
    firebaseAdminPath: string,
    portAuth: number,
    db: {
        userName: string,
        password: string,
        dbName: string,
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
    email: {
        host: string,
        port: number,
        secure: boolean,
        userName: string
        password: string
    },
    agenda: {
        url: string
        port: number
        dbName: string
        userName: string
        password: string
        jobs?: string
    }
}

export interface EmitterEvents {
    "user_login": any,
    "user_signup": UserBasic,
}

export interface UserBasic {
    id: string
    info: {
        firstName: string
        email: string
        lastName: string
        userName: string
    }
}