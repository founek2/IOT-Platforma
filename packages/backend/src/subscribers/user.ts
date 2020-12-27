import agenda from '../agenda';
import { Emitter } from '../service/eventEmitter';
import * as types from '../types';

export default function (eventEmitter: Emitter<types.EmitterEvents>) {
    eventEmitter.on("user_login", async user => {
        console.log("user_login", { user })
    })

    eventEmitter.on("user_signup", async (user: types.UserBasic) => {
        agenda.now("registration email", { user })
    })
}