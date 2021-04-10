import { DeviceModel } from "common/lib/models/deviceModel";
import { IDevice } from "common/lib/models/interface/device";
import { getProperty } from "common/lib/utils/getProperty";
import { getThing } from "common/lib/utils/getThing";
import { validateValue } from "common/lib/utils/validateValue";
import express from "express";
import { all, equals } from "ramda";
import checkControlPerm from "../middlewares/device/checkControlPerm";
import resource from "../middlewares/resource-router-middleware";
import tokenAuthMIddleware from "../middlewares/tokenAuth";
import { Actions } from "../services/actionsService";

export default ({ config, db }: any) =>
    resource({
        mergeParams: true,
        middlewares: {
            read: [tokenAuthMIddleware(), checkControlPerm({ paramKey: "deviceId" })],
        },

        async modify({ params, body }, res) {
            const { deviceId, thingId } = params;

            const doc: IDevice = await DeviceModel.findById(deviceId).lean();
            const thing = getThing(doc, thingId);

            const promises = [];
            for (const [propertyId, value] of Object.entries(body.state as { [propertyId: string]: number | string })) {
                const property = getProperty(thing, propertyId);
                const result = validateValue(property, value.toString());
                if (result.valid) promises.push(Actions.deviceSetProperty(deviceId, thingId, propertyId, value, doc));
                else return res.sendStatus(400);
            }

            const values = await Promise.all(promises);
            if (all(equals(true), values)) res.sendStatus(204);
            else res.sendStatus(400);
        },
    });
