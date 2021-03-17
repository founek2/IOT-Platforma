export enum PropertyClass {
	temperature = "temperature",
	humidity = "humidity",
	pressure = "pressure",
	voltage = "voltage",
}

export enum ComponentType {
	sensor = "sensor",
	// BinarySensor = "binary_sensor",
	switch = "switch",
}

export enum PropertyDataType {
	string = "string",
	float = "float",
	boolean = "boolean",
	integer = "integer",
}

export enum PredefinedComponentType {
	switch = ComponentType.switch,
}

export const ThingProperties: {
	[componentType in PredefinedComponentType]: Array<IThingProperty>;
} = {
	[PredefinedComponentType.switch]: [
		{
			propertyId: "power",
			name: "Zapnuto",
			dataType: PropertyDataType.string,
			format: ["on", "off"],
			settable: true,
		},
	],
};

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
	_id?: string;
	propertyId: string;
	name: string;
	propertyClass?: PropertyClass;
	unitOfMeasurement?: string;
	dataType: PropertyDataType;
	format: Array<any>;
	settable: boolean;
}

// export interface IThingSensor {
// 	_id?: any;
// 	config: {
// 		name: string;
// 		nodeId: string;
// 		componentType: ComponentType.sensor;
// 		properties: [IThingProperty];
// 	};
// 	state?: {
// 		timeStamp: Date;
// 		value: any;
// 	};
// }
