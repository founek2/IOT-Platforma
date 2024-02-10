import { OverView } from '../types/rabbitmq';
import { Actions } from './actionsService';
import { addMinutes, isBefore } from 'date-fns';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import fetch from 'node-fetch';
import { Config } from '../config';
import { PassKeeper } from 'common/lib/services/passKeeperService';
import { logger } from 'common';

const CACHE_MINUTES = 3;

type BrokerData = {
    updatedAt: Date;
    overView: OverView;
};

export class BrokerService {
    actionsService: Actions
    url: string
    managementPort: number
    passKeper: PassKeeper
    data: Maybe<BrokerData>;

    constructor(actionsService: Actions, config: Config["mqtt"], passKeper: PassKeeper) {
        this.actionsService = actionsService
        this.url = config.url.split('://')[1];
        this.managementPort = config.managementPort
        this.passKeper = passKeper
        this.data = Nothing;

        setInterval(() => {
            // TODO process data and mark disconnected devices as offline
            this.fetchData();
        }, 30 * 60 * 1000);
    }

    getOverView = async (): Promise<Maybe<OverView>> => {
        try {
            await this.fetchData();
            return this.data.map(d => d.overView)
        } catch (err) {
            return Nothing;
        }
    }

    private async getBrokerAuth() {
        return (await this.passKeper.getPass()).map((pass) => {
            const auth = Buffer.from(pass.userName + ':' + pass.password, 'utf-8').toString('base64');
            return auth;
        });
    }

    private fetchData = async () => {
        if (this.data.map(d => isBefore(new Date(), addMinutes(d.updatedAt, CACHE_MINUTES))).orDefault(false)) return;

        const auth = await this.getBrokerAuth();
        if (!auth) return;

        console.log('Loading overview Broker data');

        return fetch(`http://${this.url}:${this.managementPort}/api/overview`, {
            headers: {
                Authorization: 'Basic ' + auth,
            },
        }).then(res => res.json()).then((body) => {
            this.data = Just({
                overView: body,
                updatedAt: new Date(),
            })
        }).catch(err => logger.error(err))
    }
}



// export const BrokerService = {
//     getOverView: async function (): Promise<Maybe<OverView>> {
//         try {
//             await fetchData();
//             return Just(data.overView);
//         } catch (err) {
//             return Nothing;
//         }
//     },
// };
