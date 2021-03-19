//type SensorsObject = {name: string[], unit: string[], JSONkey: string[], count: number, sampleInterval: number, description: string[]}

/**
 * Transform sensors options from FE to BE representation
 */
export function transformSensorsForBE({ name = [], unit = [], JSONkey = [], count, sampleInterval, description = [] }) {
	const resultArr = [];
	for (let i = 0; i < count; i++) {
		resultArr.push({ name: name[i], JSONkey: JSONkey[i], unit: unit[i], description: description[i] });
	}
	return { sensors: resultArr, sampleInterval };
}

/**
 * Transform control recipe from FE to BE representation
 */

export function transformControlForBE({ name = [], type = [], JSONkey = [], count, description = [], ipAddress = [] }) {
	const resultArr = [];
	for (let i = 0; i < count; i++) {
		resultArr.push({
			name: name[i],
			JSONkey: JSONkey[i],
			type: type[i],
			description: description[i],
			ipAddress: ipAddress[i],
		});
	}
	return { control: resultArr };
}

/**
 * Transform notify form from FE to BE representation
 */

export function transformNotifyForBE({ propertyId = [], type = [], value = [], count, advanced = {} }) {
	const resultArr = [];
	for (let i = 0; i < count; i++) {
		resultArr.push({
			propertyId: propertyId[i],
			type: type[i],
			value: value[i],
			advanced: {
				interval: advanced?.interval[i],
				daysOfWeek: advanced?.daysOfWeek[i],
				from: advanced?.from[i],
				to: advanced?.to[i],
			},
		});
	}

	return { properties: resultArr };
}

/**
 * Transform sensors options from FE to BE representation
 */
export function transformSensorsForForm(arrayOfSensors, sampleInterval) {
	const len = arrayOfSensors.length;
	const resultObj = { name: [], JSONkey: [], unit: [], description: [], count: len, sampleInterval };
	for (let i = 0; i < len; i++) {
		resultObj["name"].push(arrayOfSensors[i].name);
		resultObj["JSONkey"].push(arrayOfSensors[i].JSONkey);
		resultObj["unit"].push(arrayOfSensors[i].unit);
		resultObj["description"].push(arrayOfSensors[i].description || "");
	}
	return resultObj;
}

export function transformControlForForm(arrayOfSensors) {
	const len = arrayOfSensors.length;
	const resultObj = { JSONkey: [], type: [], name: [], description: [], ipAddress: [], count: len };
	for (let i = 0; i < len; i++) {
		resultObj["name"].push(arrayOfSensors[i].name);
		resultObj["JSONkey"].push(arrayOfSensors[i].JSONkey);
		resultObj["type"].push(arrayOfSensors[i].type);
		resultObj["ipAddress"].push(arrayOfSensors[i].ipAddress);
		resultObj["description"].push(arrayOfSensors[i].description || "");
	}
	return resultObj;
}

// JSONkey = [], type = [], value = [], interval= [],  description = [], count = []
export function transformNotifyForFE(arrayOfNotify) {
	const len = arrayOfNotify.length;
	const resultObj = {
		propertyId: [],
		type: [],
		value: [],
		count: len,
		advanced: {
			interval: [],
			from: [],
			to: [],
			daysOfWeek: [],
		},
	};
	for (let i = 0; i < len; i++) {
		resultObj["propertyId"].push(arrayOfNotify[i].propertyId);
		resultObj["type"].push(arrayOfNotify[i].type);
		resultObj["value"].push(arrayOfNotify[i].value);
		resultObj["advanced"]["interval"].push(arrayOfNotify[i]?.advanced?.interval);
		resultObj["advanced"]["from"].push(arrayOfNotify[i]?.advanced?.from);
		resultObj["advanced"]["to"].push(arrayOfNotify[i]?.advanced?.to);
		resultObj["advanced"]["daysOfWeek"].push(arrayOfNotify[i]?.advanced?.daysOfWeek);
	}
	return resultObj;
}
