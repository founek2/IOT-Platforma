import type { HistoricalGeneric, HistoricalSensor } from 'common/src/models/interface/history';
import type { IThingProperty } from 'common/src/models/interface/thing';

export function convertNumericHistoryToGraphData(data: HistoricalSensor[], propertyId: IThingProperty['propertyId']) {
    let result: { x: Array<Date>; y: Array<number> } = { x: [], y: [] };
    if (!propertyId) return result;

    data.forEach((doc) => {
        if (doc.properties[propertyId]) {
            result.x = result.x.concat(doc.properties[propertyId].samples.map((rec) => new Date(rec.timestamp)));
            result.y = result.y.concat(doc.properties[propertyId].samples.map((rec) => rec.value));
        }
    });

    return result;
}

const ON = 'Zap.';
const OFF = 'Vyp.';
export function convertBoolHistoryToGraphData(data: HistoricalGeneric[], propertyId: IThingProperty['propertyId']) {
    let result: { x: Array<Date>; y: Array<string> } = { x: [], y: [] };
    if (!propertyId) return result;

    let lastTrue: { value: string; timestamp: Date } | null = null;

    data.forEach((doc) => {
        const samples = doc.properties[propertyId]?.samples;
        if (samples) {
            for (let i = 0; i < samples.length; i++) {
                const rec = samples[i];
                if (rec.value === 'true') {
                    if (!lastTrue) {
                        result.x.push(new Date(rec.timestamp));
                        result.y.push(OFF);
                    }
                    result.x.push(new Date(rec.timestamp));
                    result.y.push(ON);
                    lastTrue = rec;
                } else if (lastTrue) {
                    result.x.push(new Date(rec.timestamp));
                    result.y.push(ON);
                    result.x.push(new Date(rec.timestamp));
                    result.y.push(OFF);

                    lastTrue = null;
                }
            }
        }
    });

    if (lastTrue) {
        result.x.push(new Date());
        result.y.push(ON);
    }

    return result;
}
