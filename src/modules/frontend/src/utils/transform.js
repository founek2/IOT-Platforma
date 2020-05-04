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
 * Transform notify form from FE to BE representation
 * @param {Object} sensorsFromFE 
 */

export function transformNotifyForBE({ JSONkey = [], type = [], value = [], interval= [],  description = [], count = [] }) {
    const resultArr = [];
    for (let i = 0; i < count; i++) {
        resultArr.push({ JSONkey: JSONkey[i], type: type[i], value: value[i], interval: interval[i], description: description[i] || "" })
    }
    return { sensors: resultArr };
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
    const resultObj = { JSONkey: [], type: [], value: [], interval: [],  description: [], count: len };
    for (let i = 0; i < len; i++) {
        resultObj["value"].push(arrayOfSensors[i].value)
        resultObj["JSONkey"].push(arrayOfSensors[i].JSONkey)
        resultObj["type"].push(arrayOfSensors[i].type)
        resultObj["interval"].push(arrayOfSensors[i].interval)
        resultObj["description"].push(arrayOfSensors[i].description)
    }
    return resultObj;
}


// JSONkey = [], type = [], value = [], interval= [],  description = [], count = []
export function transformNotifyForFE(arrayOfNotify) {
    const len = arrayOfNotify.length;
    const resultObj = { value: [], JSONkey: [], type: [], interval: [], description: [], count: len };
    for (let i = 0; i < len; i++) {
        resultObj["value"].push(arrayOfNotify[i].value)
        resultObj["JSONkey"].push(arrayOfNotify[i].JSONkey)
        resultObj["type"].push(arrayOfNotify[i].type)
        resultObj["interval"].push(arrayOfNotify[i].interval)
        resultObj["description"].push(arrayOfNotify[i].description)
    }
    return resultObj;
}