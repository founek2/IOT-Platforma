import { IThing } from "./thing";

export enum DeviceStatus {
	Disconnected = "disconnected",
	Lost = "lost",
	Error = "error",
	Alert = "alert",
	Ready = "ready",
	Init = "init",
}

export type IDeviceStatus =
	| {
			value: DeviceStatus;
			timestamp: Date;
	  }
	| undefined;

export interface Device {
	_id?: any;
	info: {
		title: string;
		description?: string;
		imgPath?: string;
		deviceId: string;
		location: {
			building: string;
			room: string;
		};
	};
	permissions: {
		read: string[];
		write: string[];
		control: string[];
	};
	things: IThing[];
	state?: {
		status: IDeviceStatus;
		lastAck?: Date;
	};
	apiKey: string;
	metadata: {
		topicPrefix: string;
		publicRead?: boolean;
	};
	createdAt: Date;
	updatedAt: Date;
}
