import { normalize, schema } from 'normalizr';

const devices = [
    {
        _id: '614f778ca14d7000138fbdbf',
        info: {
            location: {
                building: 'doma',
                room: 'loznice',
            },
            name: 'Postel',
        },
        permissions: {
            read: ['61448ea123d9a70014139c92', '614701163c7af1001443b781', '6146ff1b3c7af1001443b73c'],
            write: ['61448ea123d9a70014139c92'],
            control: ['61448ea123d9a70014139c92', '614701163c7af1001443b781', '6146ff1b3c7af1001443b73c'],
        },
        things: [
            {
                _id: '614f778ca14d7000138fbdc0',
                config: {
                    name: 'Postel',
                    componentType: 'switch',
                    properties: [
                        {
                            _id: '614f778ca14d7000138fbdc1',
                            name: 'Postel led',
                            propertyClass: 'temperature',
                            dataType: 'boolean',
                            settable: true,
                            propertyId: 'power',
                        },
                    ],
                    nodeId: 'relay',
                },
                state: {
                    timestamp: '2022-01-16T21:14:25.668Z',
                    value: {
                        power: 'false',
                    },
                },
            },
        ],
        metadata: {
            realm: 'martas',
            deviceId: 'ESP-4B07A5',
        },
        createdBy: '61448ea123d9a70014139c92',
        createdAt: '2021-09-25T19:25:00.659Z',
        state: {
            status: {
                timestamp: '2022-01-17T03:30:32.705Z',
                value: 'lost',
            },
        },
    },
    {
        _id: '614f851aa14d7000138fbdee',
        info: {
            location: {
                building: 'doma',
                room: 'obývák',
            },
            name: 'Televize',
        },
        permissions: {
            read: ['61448ea123d9a70014139c92', '614701163c7af1001443b781', '6146ff1b3c7af1001443b73c'],
            write: ['61448ea123d9a70014139c92'],
            control: ['61448ea123d9a70014139c92', '614701163c7af1001443b781', '6146ff1b3c7af1001443b73c'],
        },
        things: [
            {
                _id: '614f851aa14d7000138fbdef',
                config: {
                    name: 'Televize',
                    componentType: 'switch',
                    properties: [
                        {
                            _id: '614f851aa14d7000138fbdf0',
                            name: 'TV',
                            dataType: 'boolean',
                            settable: true,
                            propertyId: 'power',
                        },
                        {
                            _id: '614f851aa14d7000138fbdf1',
                            name: 'TV',
                            dataType: 'integer',
                            format: {
                                min: 0,
                                max: 80,
                            },
                            settable: true,
                            propertyId: 'volume',
                        },
                    ],
                    nodeId: 'television',
                },
                state: {
                    timestamp: '2022-01-14T16:37:47.335Z',
                    value: {
                        power: 'true',
                        volume: '16',
                    },
                },
            },
        ],
        metadata: {
            realm: 'martas',
            deviceId: 'BOT-TV198111',
        },
        createdBy: '61448ea123d9a70014139c92',
        createdAt: '2021-09-25T20:22:50.794Z',
        state: {
            status: {
                timestamp: '2022-01-18T23:48:06.334Z',
                value: 'lost',
            },
        },
    },
];

const thing = new schema.Entity(
    'things',
    {},
    {
        idAttribute: '_id',
    }
);

const device = new schema.Entity(
    'devices',
    {
        things: [thing],
    },
    {
        idAttribute: '_id',
    }
);

const normalizedData = normalize(devices, [device]);
console.log(normalizedData);
