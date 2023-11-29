import { JwtService, InfluxService } from "common";
import { MqttService } from "../services/mqtt";

export interface UpdateThingState {
    _id: string;
    state: any;
}
export type Context = {
    influxService: InfluxService,
    jwtService: JwtService
    mqttService: MqttService
}

export type HasContext = {
    context: Context
}