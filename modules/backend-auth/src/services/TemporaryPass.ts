import { Security } from 'common/lib/services/SecurityService';
import addMinutes from 'date-fns/addMinutes';
import isBefore from 'date-fns/isBefore';
import { UserModel } from 'common/lib/models/userModel';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { logger } from 'common/lib/logger';
import { BusEmitterType, Pass } from "common/lib/interfaces/asyncEmitter"

async function generatePass(): Promise<Maybe<Pass>> {
    logger.debug('Generating new pass');
    const token = Security.getRandomToken(12);
    const doc = await UserModel.findOne({ groups: 'root' }).lean();
    if (!doc?.info.userName) return Nothing;

    return Just({ validTo: addMinutes(new Date(), 60), userName: doc.info.userName, password: token });
}

export class TemporaryPass {
    private currentPass: Maybe<Pass> = Nothing;
    private bus: BusEmitterType

    constructor(bus: BusEmitterType) {
        this.bus = bus;

        this.emitPass();
        setInterval(this.emitPass, 50 * 60 * 1000)
    }

    async emitPass() {
        const pass = await generatePass();
        this.bus.emit("new_pass", pass)
    }

    // async getPass(): Promise<Maybe<Pass>> {
    //     this.currentPass = await new Promise((res) => {
    //         this.currentPass
    //             .ifJust(async (pass) => (pass.validTo <= new Date() ? res(await generatePass()) : res(Just(pass))))
    //             .ifNothing(async () => res(await generatePass()));
    //     });
    //     return this.currentPass;
    // }

    validatePass(pass: { userName: string; password: string }): boolean {
        return this.currentPass
            .map((curr) => isBefore(new Date(), curr.validTo) && curr.password === pass.password)
            .orDefault(false);
    }

}

