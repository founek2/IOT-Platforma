import fetch from "node-fetch";
import config from "common/lib/config";
import { IDevice, DeviceCommand } from "common/lib/models/interface/device";

export class Actions {
    public static async deviceInitPairing(deviceId: string, apiKey: string): Promise<boolean> {
        const res = await fetch(
            "http://localhost:" + config.portAuth + "/api/actions/device/" + deviceId + "/pairing/init",
            {
                method: "PUT",
                body: JSON.stringify({ apiKey }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return res.status === 204;
    }

    public static async deviceSetProperty(
        deviceId: string,
        nodeId: string,
        propertyId: string,
        value: string | number,
        device: IDevice
    ): Promise<boolean> {
        const res = await fetch(
            `http://localhost:${config.portAuth}/api/actions/device/${deviceId}/thing/${nodeId}/property/${propertyId}`,
            {
                method: "PATCH",
                body: JSON.stringify({ value, device }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return res.status === 204;
    }

    public static async deviceSendCommand(
        doc: IDevice,
        command: DeviceCommand
    ): Promise<boolean> {
        const res = await fetch(
            `http://localhost:${config.portAuth}/api/actions/device/${doc._id}`,
            {
                method: "POST",
                body: JSON.stringify({ command, device: doc }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return res.status === 204;
    }
}
