import { IDevice } from "common/lib/models/interface/device";
import { IDiscovery } from "common/lib/models/interface/discovery";
import { HistoricalSensor } from "common/lib/models/interface/history";
import { IThing } from "common/lib/models/interface/thing";

export interface ControlProps {
	name: string;
	description: string;
	onClick: React.ChangeEvent<any>;
	data: any;
	ackTime: Date;
	afk: boolean;
	pending: boolean;
	forceUpdate: React.ChangeEventHandler;
}

export interface IState {
	application: {
		user: any;
		notifications: any[];
		users: any[];
		devices: { data: IDevice[]; lastFetch?: Date; lastUpdate?: Date };
		discovery: { data: IDiscovery[]; lastFetch?: Date; lastUpdate?: Date };
		thingHistory: {
			data: HistoricalSensor[];
			deviceId: IDevice["_id"];
			thingId: IThing["_id"];
			lastFetch?: Date;
		};
	};
	fieldDescriptors: any;
	tmpData: {
		dialog: {};
	};
	history: {
		pathName: string;
		hash: string;
		search: string;
		query: { [key: string]: string };
	};
}
