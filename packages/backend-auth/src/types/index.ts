export interface Config {
    portAuth: number;
    dbUri: string;
    jwt: {
        privateKey: string;
        publicKey: string;
        expiresIn: string;
    };
}

export interface UpdateThingState {
    _id: string;
    state: any;
}
