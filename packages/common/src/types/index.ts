import { CONTROL_TYPES } from "../constants";
import { Device } from "../models/interface/device";
import { IThing } from "../models/interface/thing";

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
	_id: Device["_id"];
	thing: {
		_id: IThing["_id"];
		state: IThing["state"];
	};
};
