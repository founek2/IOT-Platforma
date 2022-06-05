import { OverView } from '../types/rabbitmq';
import fetch from 'node-fetch';
import config from '@common/config';
import { Actions } from './actionsService';
import { isBefore, addMinutes, isAfter } from 'date-fns';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';

const CACHE_MINUTES = 3;

type BrokerData = {
    updatedAt: Date;
    overView: OverView;
};

let data: BrokerData;

async function fetchData() {
    if (data?.updatedAt && isAfter(addMinutes(data.updatedAt, CACHE_MINUTES), new Date())) return;

    const url = config.mqtt.url.split('://')[1];
    const auth = await Actions.getBrokerAuth();
    if (!auth) return;

    console.log('Loading overview Broker data');
    const res = await fetch(`http://${url}:${config.mqtt.managementPort}/api/overview`, {
        headers: {
            Authorization: 'Basic ' + auth,
        },
    });
    const body = await res.json();

    data = {
        overView: body,
        updatedAt: new Date(),
    };
}

export const BrokerService = {
    getOverView: async function (): Promise<Maybe<OverView>> {
        try {
            await fetchData();
            return Just(data.overView);
        } catch (err) {
            return Nothing;
        }
    },
};
