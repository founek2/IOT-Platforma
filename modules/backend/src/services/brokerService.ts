import { OverView } from '../types/rabbitmq';
import { Actions } from './actionsService';
import { addMinutes, isAfter } from 'date-fns';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import fetch from 'node-fetch';
import { Config } from '../config';
import { PassKeeper } from 'common/lib/services/passKeeperService';

const CACHE_MINUTES = 3;

type BrokerData = {
    updatedAt: Date;
    overView: OverView;
};

let data: BrokerData;

export class BrokerService {
    actionsService: Actions
    url: string
    managementPort: number
    passKeper: PassKeeper

    constructor(actionsService: Actions, config: Config["mqtt"], passKeper: PassKeeper) {
        this.actionsService = actionsService
        this.url = config.url.split('://')[1];
        this.managementPort = config.managementPort
        this.passKeper = passKeper
    }

    getOverView = async (): Promise<Maybe<OverView>> => {
        try {
            await this.fetchData();
            return Just(data.overView);
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
        if (data?.updatedAt && isAfter(addMinutes(data.updatedAt, CACHE_MINUTES), new Date())) return;

        const auth = await this.getBrokerAuth();
        if (!auth) return;

        console.log('Loading overview Broker data');
        const res = await fetch(`http://${this.url}:${this.managementPort}/api/overview`, {
            headers: {
                Authorization: 'Basic ' + auth,
            },
        });
        const body = await res.json() as any;

        data = {
            overView: body,
            updatedAt: new Date(),
        };
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
