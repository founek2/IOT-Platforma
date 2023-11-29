import { IDevice, DeviceCommand } from 'common/lib/models/interface/device';
import { IDiscovery } from 'common/lib/models/interface/discovery';
import { IThing, IThingProperty } from 'common/lib/models/interface/thing';
import { AuthConnector } from 'common/lib/connectors/authConnector';
import fetch from 'node-fetch';

/**
 * Service to communicate with backend-mqtt, allowing sending data directly to devices
 */
export class Actions {
    serviceMqttUri: string
    serviceAuthUri: string

    constructor(serviceMqttUri: string, serviceAuthUri: string) {
        this.serviceMqttUri = serviceMqttUri;
        this.serviceAuthUri = serviceAuthUri;
    }

    /**
     * send ApiKey to device over MQTT
     * @param {IDiscovery["_id"]} deviceId
     * @param {IDevice["apiKey"]} apiKey
     */
    public async deviceInitPairing(deviceId: IDiscovery['_id'], apiKey: string): Promise<boolean> {
        const res = await fetch(this.serviceMqttUri + '/api/actions/device/' + deviceId + '/pairing/init', {
            method: 'PUT',
            body: JSON.stringify({ apiKey }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        return res.status === 204;
    }

    /**
     * Set status of devices`s property (control it) over MQTT
     */
    public async deviceSetProperty(
        deviceId: IDevice['_id'],
        nodeId: IThing['config']['nodeId'],
        propertyId: IThingProperty['propertyId'],
        value: string | number,
        device: IDevice
    ): Promise<boolean> {
        const res = await fetch(
            `${this.serviceMqttUri}/api/actions/device/${deviceId}/thing/${nodeId}/property/${propertyId}`,
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
    public async deviceSendCommand(doc: IDevice, command: DeviceCommand): Promise<boolean> {
        const res = await fetch(`${this.serviceMqttUri}/api/actions/device/${doc._id}`, {
            method: 'POST',
            body: JSON.stringify({ command, device: doc }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        return res.status === 204;
    }

    public async getBrokerAuth() {
        const result = await AuthConnector(`${this.serviceAuthUri}`).getPass();
        return result.map((pass) => {
            const auth = Buffer.from(pass.userName + ':' + pass.password, 'utf-8').toString('base64');
            return auth;
        });
    }
}
