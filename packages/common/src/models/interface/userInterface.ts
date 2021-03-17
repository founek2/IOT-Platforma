import { AuthTypes } from "../../constants";

export interface IUser {
	_id?: any;
	info: {
		userName: string;
		firstName: string;
		lastName: string;
		email?: string;
		phoneNumber?: string;
	};
	auth: {
		type: AuthTypes;
		password: string;
	};
	realm: string;
	groups: string[];
	notifyTokens: string[];
	createdAt: Date;
	updatedAt: Date;
}
