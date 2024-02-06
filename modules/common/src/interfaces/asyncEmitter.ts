import { Maybe, Nothing } from "purify-ts";
import { TypedEmitter } from "../emitter/typedEmitter";
import { DeviceCommand, IDevice } from "../models/interface/device";
import { IThing, IThingProperty } from "../models/interface/thing";

export type Pass = {
    password: string;
    userName: string;
    validTo: Date;
};

export interface Events {
    "new_pass": Maybe<Pass>,
    "request_pass": void,
    "pairing_new_device": IDevice,
    "device_set_property_value": { device: IDevice, nodeId: IThing['config']['nodeId'], propertyId: IThingProperty['propertyId'], value: string | number | boolean },
    "device_send_command": { device: IDevice, command: DeviceCommand }
}

export class BusEmitter extends TypedEmitter<Events> { }

export type BusEmitterType = TypedEmitter<Events>

// Move to different folder
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