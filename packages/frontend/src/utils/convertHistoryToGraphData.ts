import type { HistoricalGeneric, HistoricalSensor } from 'common/src/models/interface/history';
import type { IThingProperty } from 'common/src/models/interface/thing';
import { Measurement, MeasurementBool, MeasurementNumber } from 'common/src/types';

export function convertNumericHistoryToGraphData(data: Measurement[], propertyId: IThingProperty['propertyId']) {
    let result: { x: Array<Date>; y: Array<number> } = { x: [], y: [] };
    if (!propertyId) return result;

    data.forEach((point) => {
        if (point.propertyId == propertyId) {
            result.x.push(new Date(point._time));
            result.y.push(point._value as number);
        }
    });

    return result;
}

const ON = 'Zap.';
const OFF = 'Vyp.';
export function convertBoolHistoryToGraphData(data: Measurement[], propertyId: IThingProperty['propertyId']) {
    let result: { x: Array<Date>; y: Array<string> } = { x: [], y: [] };
    if (!propertyId) return result;

    let lastTrue: Measurement | null = null;

    data.forEach((point) => {
        if (point.propertyId == propertyId) {
            if (point._value == true) {
                if (!lastTrue) {
                    result.x.push(new Date(point._time));
                    result.y.push(OFF);
                }

                result.x.push(new Date(point._time));
                result.y.push(ON);
                lastTrue = point;
            } else if (lastTrue) {
                result.x.push(new Date(point._time));
                result.y.push(ON);
                result.x.push(new Date(point._time));
                result.y.push(OFF);
                lastTrue = null;
            }
        }
    });
    // data.forEach((doc) => {
    //     const samples = doc.properties[propertyId]?.samples;
    //     if (samples) {
    //         for (let i = 0; i < samples.length; i++) {
    //             const rec = samples[i];
    //             if (rec.value === 'true') {
    //                 if (!lastTrue) {
    //                     result.x.push(new Date(rec.timestamp));
    //                     result.y.push(OFF);
    //                 }
    //                 result.x.push(new Date(rec.timestamp));
    //                 result.y.push(ON);
    //                 lastTrue = rec;
    //             } else if (lastTrue) {
    //                 result.x.push(new Date(rec.timestamp));
    //                 result.y.push(ON);
    //                 result.x.push(new Date(rec.timestamp));
    //                 result.y.push(OFF);

    //                 lastTrue = null;
    //             }
    //         }
    //     }
    // });

    if (lastTrue) {
        result.x.push(new Date());
        result.y.push(ON);
    }

    return result;
}
