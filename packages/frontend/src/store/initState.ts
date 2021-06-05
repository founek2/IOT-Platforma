import fieldDescriptors from 'common/lib/fieldDescriptors';
import { IState } from '../types';

export const createState = (): IState => ({
    accessTokens: { data: [] },
    application: {
        user: undefined,
        notifications: [],
        users: [],
        devices: { data: [] },
        discovery: { data: [] },
        thingHistory: {
            data: [],
        },
        userNames: {
            data: [],
        },
    },
    formsData: {
        registeredFields: {},
    },
    fieldDescriptors,
    tmpData: {
        dialog: {},
    },
    history: {
        pathName: '/',
        hash: '',
        search: '',
        query: {},
    },
});
