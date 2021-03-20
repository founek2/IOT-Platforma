import { ComponentType, PropertyClass } from "./thing";

export interface IDiscoveryProperty {
	propertyClass?: PropertyClass;
	name?: string;
	unitOfMeasurement?: string;
	dataType?: string;
	format?: string;
}

export interface IDiscoveryThing {
	_id?: any;
	config: {
		name?: string;
		nodeId?: string;
		componentType?: ComponentType;
		properties: { [propertyId: string]: IDiscoveryProperty };
	};
	state?: {
		timeStamp: Date;
		value: any;
	};
}

export interface IDiscovery {
	_id?: any;
	deviceId: string;
	realm: string;
	name: string;
	things: { [nodeId: string]: IDiscoveryThing };
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
