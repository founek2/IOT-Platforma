/**
 * Transform sensors options from FE to BE representation
 * @param {Object} sensorsFromFE 
 */

export function transformSensorsForBE({ name, unit, JSONkey, count, sampleInterval, description }) {
    const resultArr = [];
    for (let i = 0; i < count; i++) {
        resultArr.push({ name: name[i], JSONkey: JSONkey[i], unit: unit[i], description: description[i] })
    }
    return { sensors: resultArr, sampleInterval };
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