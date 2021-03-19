import { IDevice } from "./device";
import { IThing, IThingProperty } from "./thing";
import { IUser } from "./userInterface";

export enum NotifyType {
	always = "always",
	below = "below",
	over = "over",
}

export interface INotifyThingProperty {
	_id?: any;
	propertyId: IThingProperty["propertyId"];
	type: NotifyType;
	value: string | number;
	advanced: {
		interval: number;
		from: string;
		to: string;
		daysOfWeek: number[];
	};
	tmp: {
		lastSendAt: Date;
		lastSatisfied: Boolean;
	};
}

export interface INotifyThing {
	_id?: any;
	nodeId: IThing["config"]["nodeId"];
	properties: INotifyThingProperty[];
}

export interface INotify {
	_id?: any;
	deviceId: IDevice["_id"];
	userId: IUser["_id"];
	things: INotifyThing[];
}
