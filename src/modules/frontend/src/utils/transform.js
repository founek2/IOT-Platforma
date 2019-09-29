/**
 * Transform sensors options from FE to BE representation
 * @param {Object} sensorsFromFE 
 */

export function transformSensorsForBE({ name = [], unit = [], JSONkey = [], count, sampleInterval, description = [] }) {
    const resultArr = [];
    for (let i = 0; i < count; i++) {
        resultArr.push({ name: name[i], JSONkey: JSONkey[i], unit: unit[i], description: description[i] || "" })
    }
    return { sensors: resultArr, sampleInterval };
}

/**
 * Transform control recipe from FE to BE representation
 * @param {Object} sensorsFromFE 
 */

export function transformControlForBE({ name = [], type = [], JSONkey = [], count = [], description = [] }) {
    const resultArr = [];
    for (let i = 0; i < count; i++) {
        resultArr.push({ name: name[i], JSONkey: JSONkey[i], type: type[i], description: description[i] || "" })
    }
    return { control: resultArr };
}

/**
 * Transform sensors options from FE to BE representation
 * @param {Object} sensorsFromBE
 */
export function transformSensorsForForm(arrayOfSensors, sampleInterval) {
    const len = arrayOfSensors.length;
    const resultObj = { name: [], JSONkey: [], unit: [], description: [], count: len, sampleInterval };
    for (let i = 0; i < len; i++) {
        resultObj["name"].push(arrayOfSensors[i].name)
        resultObj["JSONkey"].push(arrayOfSensors[i].JSONkey)
        resultObj["unit"].push(arrayOfSensors[i].unit)
        resultObj["description"].push(arrayOfSensors[i].description)
    }
    return resultObj;
}

export function transformControlForForm(arrayOfSensors) {
    const len = arrayOfSensors.length;
    const resultObj = { name: [], JSONkey: [], type: [], description: [], count: len };
    for (let i = 0; i < len; i++) {
        resultObj["name"].push(arrayOfSensors[i].name)
        resultObj["JSONkey"].push(arrayOfSensors[i].JSONkey)
        resultObj["type"].push(arrayOfSensors[i].type)
        resultObj["description"].push(arrayOfSensors[i].description)
    }
    return resultObj;
}