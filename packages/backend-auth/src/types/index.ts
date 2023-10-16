export interface Config {
    portAuth: number;
    dbUri: string;
    jwt: {
        privateKey: string;
        publicKey: string;
        expiresIn: string;
    };
    oauth: {
        seznam: {
            clientSecret?: string;
            clientId?: string;
            iconUrl: string;
            endpoint: string;
            scopes: string[];
        };
    };
}

export interface UpdateThingState {
    _id: string;
    state: any;
}
