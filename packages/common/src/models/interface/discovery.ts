import { ComponentType, DeviceClass } from "./thing";

export interface IPropertyDiscovery {
	deviceClass?: DeviceClass;
	name?: string;
	unitOfMeasurement?: string;
	dataType?: string;
}
export interface IThingDiscovery {
	_id?: any;
	config: {
		name?: string;
		nodeId?: string;
		componentType?: ComponentType;
		properties: { [propertyId: string]: IPropertyDiscovery };
	};
	state?: {
		timeStamp: Date;
		value: any;
	};
}

export interface IDeviceDiscovery {
	_id?: any;
	deviceId: string;
	userName: string;
	name: string;
	things: { [nodeId: string]: IThingDiscovery };
	createdAt: Date;
	updatedAt: Date;
	state: {
		status: {
			value: string;
			timestamp: Date;
		};
	};
	pairing: boolean;
}
