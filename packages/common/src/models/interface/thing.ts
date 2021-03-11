export enum DeviceClass {
	Temperature = "temperature",
	Humidity = "humidity",
	Pressure = "pressure",
	Voltage = "voltage",
}

export enum ComponentType {
	Sensor = "sensor",
	BinarySensor = "binary_sensor",
	Switch = "switch",
}

export enum PropertyDataTypes {
	String = "string",
	Float = "float",
	Boolean = "boolean",
	Integer = "integer",
}

export interface IThing {
	_id?: any;
	config: {
		name: string;
		nodeId: string;
		componentType: ComponentType;
		properties: IThingProperty[];
	};
	state?: {
		timestamp: Date;
		value: any;
	};
}

export interface IThingProperty {
	deviceClass?: DeviceClass;
	name: string;
	unitOfMeasurement: string;
	propertyId: string;
	dataType: PropertyDataTypes;
}

export interface IThingSensor {
	_id?: any;
	config: {
		name: string;
		nodeId: string;
		componentType: ComponentType.Sensor;
		properties: [IThingProperty];
	};
	state?: {
		timeStamp: Date;
		value: any;
	};
}
