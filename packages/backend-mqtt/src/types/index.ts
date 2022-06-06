export interface Config {
    homepage: string;
    portMqtt: number;
    serviceMqttUri: string;
    serviceAuthUri: string;
    firebaseAdminPath?: string;
    dbUri: string;
    jwt: {
        privateKey: string;
        publicKey: string;
        expiresIn: string;
    };
    influxDb: {
        url: string;
        apiKey: string;
        organization: string;
        bucket: string;
    };
    mqtt: {
        url: string;
        port: number;
    };
}

export interface UpdateThingState {
    _id: string;
    state: any;
}
