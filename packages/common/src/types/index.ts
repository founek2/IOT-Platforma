import { CONTROL_TYPES } from "../constants";
import { IDevice } from "../models/interface/device";
import { IThing } from "../models/interface/thing";

export interface Config {
	port: number;
	bodyLimit: string;
	homepage: string;
	imagesPath: string;
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
	testUser: string;
	testPassword: string;
	email: {
		host: string;
		port: number;
		secure: boolean;
		userName: string;
		password: string;
	};
	agenda: {
		url: string;
		port: number;
		dbName: string;
		userName: string;
		password: string;
		jobs?: string;
	};
	mqtt: {
		url: string;
		port: number;
		userName: string;
		password: string;
	};
}

export type FormType<T> = { JSONkey: string } & T;
export type ControlState = { state: any; updatedAt: string } | null;
export type ControlRecipe = {
	name: string;
	type: CONTROL_TYPES;
	JSONkey: string;
	description?: string | null;
	ipAddress?: string;
	metadata?: { [key: string]: any };
};
export type StateUpdate = any;

export type ChangeHandler<T = any> = (
	form: FormType<T>,
	currentState: ControlState,
	recipe: ControlRecipe
) => Promise<StateUpdate>;

export type AckHandler = (recipe: ControlRecipe) => Promise<boolean>;

export type SocketThingState = {
	_id: IDevice["_id"];
	thing: {
		_id: IThing["_id"];
		state: IThing["state"];
	};
};
