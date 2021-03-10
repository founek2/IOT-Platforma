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

export interface IThing {
	_id?: any;
	config: {
		deviceClass?: DeviceClass;
		name: string;
		unitOfMeasurement?: string;
		nodeId: string;
		propertyId?: string;
		componentType: ComponentType;
	};
	state?: {
		timeStamp: Date;
		value: any;
	};
}
