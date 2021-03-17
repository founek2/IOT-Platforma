import { IDevice } from "./device";
import { IThing } from "./thing";

export interface HistoricalSensor {
	_id?: any;
	device: IDevice["_id"];
	thing: IThing["_id"];
	day: Date;
	first: Date;
	last: Date;
	properties: {
		[propertyId: string]: {
			propertyId: string;
			samples: [{ value: number; timestamp: Date }];
			sum: {
				day: number;
				night: number;
			};
			nsamples: {
				day: number;
				night: number;
			};
			min: number;
			max: number;
		};
	};
	nsamples: number;
}
