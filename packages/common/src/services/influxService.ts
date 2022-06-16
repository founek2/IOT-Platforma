import { IThing, IThingProperty, PropertyDataType } from '../models/interface/thing';
import { OrgsAPI, BucketsAPI, Organization, QueryAPI } from '@influxdata/influxdb-client-apis';
import { InfluxDB, Point, WriteApi, QueryApi } from '@influxdata/influxdb-client';
import { Config, Measurement } from '../types';
import { IDevice } from '../models/interface/device';

export let influxDB: InfluxDB;
export let bucketsApi: BucketsAPI;
export let writeApi: WriteApi;
export let queryApi: QueryApi;

let BUCKET: string;

export class InfluxService {
    public static init(config: Config['influxDb']) {
        BUCKET = config.bucket;

        influxDB = new InfluxDB({ url: config.url, token: config.apiKey });
        writeApi = influxDB.getWriteApi(config.organization, BUCKET);
        bucketsApi = new BucketsAPI(influxDB);
        queryApi = influxDB.getQueryApi(config.organization);
        // console.log(writeApi, queryApi);
    }

    public static createMeasurement(
        deviceId: string,
        deviceName: string,
        thingId: IThing['config']['nodeId'],
        property: IThingProperty,
        sample: { value: any; timestamp: Date }
    ): Point {
        const point = new Point('measurement')
            .tag('deviceId', deviceId)
            .tag('deviceName', deviceName)
            .tag('thingId', thingId)
            .tag('propertyId', property.propertyId)
            .timestamp(sample.timestamp);

        if (property.dataType === PropertyDataType.boolean) {
            point.booleanField('value_bool', sample.value === true || sample.value === 'true' ? true : false);
        } else if (property.dataType === PropertyDataType.integer) {
            point.intField('value_int', Number(sample.value));
        } else if (property.dataType === PropertyDataType.float) {
            point.floatField('value_float', Number(sample.value));
        } else {
            point.stringField('value_string', sample.value);
        }
        return point;
    }

    public static async saveMeasurements(points: Point[]) {
        writeApi.writePoints(points);
    }

    public static async saveMeasurement(point: Point) {
        writeApi.writePoint(point);
    }

    public static async getOrg(org: string): Promise<Organization> {
        const orgsAPI = new OrgsAPI(influxDB);
        const organizations = await orgsAPI.getOrgs({ org });
        if (!organizations || !organizations.orgs || !organizations.orgs.length) {
            throw new Error(`No organization named "${org}" found!`);
        }

        return organizations.orgs[0]!;
    }

    public static async deleteAndCreateBucket(org: string, name: string) {
        const organization = await InfluxService.getOrg(org);
        if (!organization) return null;

        console.log(`Using organization "${org}" identified by "${organization.id}"`);

        const buckets = await bucketsApi.getBuckets({ orgID: organization.id, name });
        if (buckets && buckets.buckets && buckets.buckets.length) {
            console.log(`Bucket named "${name}" already exists"`);
            const bucketID = buckets.buckets[0].id!;
            console.log(`*** Delete Bucket "${name}" identified by "${bucketID}" ***`);
            await bucketsApi.deleteBucketsID({ bucketID });
        }

        await bucketsApi.postBuckets({ body: { orgID: organization.id!, name, retentionRules: [] } });
    }

    public static async getMeasurements(deviceId: IDevice['_id'], thingId: IThing['_id'], from: Date, to: Date) {
        const fluxQuery = `
        from(bucket: "${BUCKET}")
        |> range(start: ${from.toISOString()}, stop: ${to.toISOString()})
        |> filter(fn: (r) => r["deviceId"] == "${deviceId}")
        |> filter(fn: (r) => r["thingId"] == "${thingId}")
        |> filter(fn: (r) => r["_field"] == "value_float" or r["_field"] == "value_int")
        |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
       `;
        console.log('query', fluxQuery);

        const rows: Measurement[] = [];

        return new Promise<Measurement[]>((resolve, reject) =>
            queryApi.queryRows(fluxQuery, {
                next(row, tableMeta) {
                    const o = tableMeta.toObject(row) as Measurement;
                    rows.push(o);
                },
                error(error) {
                    console.log('QUERY FAILED', error);
                    reject(error);
                },
                complete() {
                    console.log('QUERY FINISHED');
                    resolve(rows);
                },
            })
        );
    }
}
