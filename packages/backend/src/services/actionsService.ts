import fetch from 'node-fetch';
import config from '@common/config';
import { IDevice, DeviceCommand } from '@common/models/interface/device';
import { IDiscovery } from '@common/models/interface/discovery';
import { IThing, IThingProperty } from '@common/models/interface/thing';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
/**
 * Service to communicate with backend-mqtt, allowing sending data directly to devices
 */
export class Actions {
    /**
     * send ApiKey to device over MQTT
     * @param {IDiscovery["_id"]} deviceId
     * @param {IDevice["apiKey"]} apiKey
     */
    public static async deviceInitPairing(deviceId: IDiscovery['_id'], apiKey: string): Promise<boolean> {
        const res = await fetch(
            'http://localhost:' + config.portAuth + '/api/actions/device/' + deviceId + '/pairing/init',
            {
                method: 'PUT',
                body: JSON.stringify({ apiKey }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        return res.status === 204;
    }

    /**
     * Set status of devices`s property (control it) over MQTT
     */
    public static async deviceSetProperty(
        deviceId: IDevice['_id'],
        nodeId: IThing['config']['nodeId'],
        propertyId: IThingProperty['propertyId'],
        value: string | number,
        device: IDevice
    ): Promise<boolean> {
        const res = await fetch(
            `http://localhost:${config.portAuth}/api/actions/device/${deviceId}/thing/${nodeId}/property/${propertyId}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ value, device }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        return res.status === 204;
    }

    /**
     * Send command to device over MQTT
     * @param {IDevice} doc
     * @param {DeviceCommand} command
     */
    public static async deviceSendCommand(doc: IDevice, command: DeviceCommand): Promise<boolean> {
        const res = await fetch(`http://localhost:${config.portAuth}/api/actions/device/${doc._id}`, {
            method: 'POST',
            body: JSON.stringify({ command, device: doc }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        return res.status === 204;
    }

    public static async getBrokerAuth(): Promise<Maybe<string>> {
        const res = await fetch(`http://localhost:${config.portAuth}/api/actions/broker/auth`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        return res.status === 200 ? Just((await res.json()).auth) : Nothing;
    }
}
