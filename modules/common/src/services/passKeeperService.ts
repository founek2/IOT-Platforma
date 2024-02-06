import { Maybe, Nothing } from "purify-ts";
import { BusEmitterType, Pass } from "../interfaces/asyncEmitter";

export class PassKeeper {
    pass: Maybe<Pass>

    constructor(bus: BusEmitterType) {
        this.pass = Nothing;

        bus.on("new_pass", (result) => {
            this.pass = result;
        })
    }

    getPass(): Maybe<Pass> {
        return this.pass;
    }
}