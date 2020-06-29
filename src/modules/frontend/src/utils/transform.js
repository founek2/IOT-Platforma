/**
 * Transform sensors options from FE to BE representation
 * @param {Object} sensorsFromFE 
 */
export function transformSensorsForBE({ name = [], unit = [], JSONkey = [], count, sampleInterval, description = [] }) {
    const resultArr = [];
    for (let i = 0; i < count; i++) {
        resultArr.push({ name: name[i], JSONkey: JSONkey[i], unit: unit[i], description: description[i] })
    }
    return { sensors: resultArr, sampleInterval };
}

/**
 * Transform control recipe from FE to BE representation
 * @param {Object} sensorsFromFE 
 */

export function transformControlForBE({ name = [], type = [], JSONkey = [], count, description = [] }) {
    const resultArr = [];
    for (let i = 0; i < count; i++) {
        resultArr.push({ name: name[i], JSONkey: JSONkey[i], type: type[i], description: description[i] })
    }
    return { control: resultArr };
}


/**
 * Transform notify form from FE to BE representation
 * @param {Object} sensorsFromFE 
 */

export function transformNotifyForBE({ JSONkey = [], type = [], value = [], description = [], count, advanced = {}, key }) {
    const resultArr = [];
    for (let i = 0; i < count; i++) {
        resultArr.push({
            JSONkey: JSONkey[i], type: type[i], value: value[i], description: description[i], advanced: {
                interval: advanced?.interval[i],
                daysOfWeek: advanced?.daysOfWeek[i],
                from: advanced?.from[i],
                to: advanced?.to[i],
            }
        })
    }

    return { sensors: resultArr, key };
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
    const resultObj = { JSONkey: [], type: [], name: [], description: [], count: len };
    for (let i = 0; i < len; i++) {
        resultObj["name"].push(arrayOfSensors[i].name)
        resultObj["JSONkey"].push(arrayOfSensors[i].JSONkey)
        resultObj["type"].push(arrayOfSensors[i].type)
        resultObj["description"].push(arrayOfSensors[i].description)
    }
    return resultObj;
}


// JSONkey = [], type = [], value = [], interval= [],  description = [], count = []
export function transformNotifyForFE(arrayOfNotify) {
    const len = arrayOfNotify.length;
    const resultObj = {
        value: [], JSONkey: [], type: [], description: [], count: len, advanced: {
            interval: [],
            from: [],
            to: [],
            daysOfWeek: [],
        }
    };
    for (let i = 0; i < len; i++) {
        resultObj["value"].push(arrayOfNotify[i].value)
        resultObj["JSONkey"].push(arrayOfNotify[i].JSONkey)
        resultObj["type"].push(arrayOfNotify[i].type)
        resultObj["description"].push(arrayOfNotify[i].description)
        resultObj["advanced"]["interval"].push(arrayOfNotify[i]?.advanced?.interval)
        resultObj["advanced"]["from"].push(arrayOfNotify[i]?.advanced?.from)
        resultObj["advanced"]["to"].push(arrayOfNotify[i]?.advanced?.to)
        resultObj["advanced"]["daysOfWeek"].push(arrayOfNotify[i]?.advanced?.daysOfWeek)
    }
    return resultObj;
}