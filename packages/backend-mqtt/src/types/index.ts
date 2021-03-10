export interface Config {
	homepage: string;
	portAuth: number;
	firebaseAdminPath: string;
	db: {
		userName: string;
		password: string;
		dbName: string;
		url: string;
		port: number;
	};
	jwt: {
		privateKey: string;
		publicKey: string;
		expiresIn: string;
	};
	mqtt: {
		url: string;
		port: number;
		userName: string;
		password: string;
	};
	testUser: string;
	testPassword: string;
	agenda: {
		url: string;
		port: number;
		dbName: string;
		userName: string;
		password: string;
		jobs?: string;
	};
}

export interface UpdateThingState {
	_id: string;
	state: any;
}
