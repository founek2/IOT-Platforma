import fieldDescriptors from "common/lib/fieldDescriptors";
import { DiscoveryModel } from "common/lib/models/deviceDiscoveryModel";
import { DeviceModel } from "common/lib/models/deviceModel";
import { IDiscoveryProperty, IDiscoveryThing } from "common/lib/models/interface/discovery";
import {
    ComponentType,
    IThing,
    PropertyDataType,
} from "common/lib/models/interface/thing";
import formDataChecker from "../middlewares/formDataChecker";
import resource from "../middlewares/resource-router-middleware";
import tokenAuthMIddleware from "../middlewares/tokenAuth";
import mongoose from "mongoose";
import { assoc, assocPath, ifElse, lensPath, map, o, over, pathSatisfies, toPairs } from "ramda";
import checkControlPerm from "../middlewares/device/checkControlPerm";
import checkReadPerm from "../middlewares/device/checkReadPerm";
import checkWritePerm from "../middlewares/device/checkWritePerm";
import { Actions } from "../services/actionsService";
import eventEmitter from "../services/eventEmitter";

const ObjectId = mongoose.Types.ObjectId;

export default () =>
    resource({
        middlewares: {
            index: [tokenAuthMIddleware()],
            delete: [tokenAuthMIddleware(), formDataChecker(fieldDescriptors)],
            create: [tokenAuthMIddleware(), formDataChecker(fieldDescriptors)],
        },

        /** GET / - List all entities */
        async index({ user, root }: any, res: any) {
            console.log("user - ", user.info.userName);
            const docs = await DiscoveryModel.find({ realm: user.realm, pairing: { $ne: true } });

            res.send({ docs });
        },

        async delete({ body, user }: any, res: any) {
            // TODO check permission
            const selected = body.formData.DISCOVERY_DEVICES.selected;
            const result = await DiscoveryModel.deleteMany({
                _id: { $in: selected.map(ObjectId) },
            });
            console.log("deleted", result);
            eventEmitter.emit("devices_delete", selected);
            res.sendStatus(204);
        },

        /** POST / - Create a new entity */
        async create({ body, user }: any, res: any) {
            // TODO permission check
            const { formData } = body;

            if (formData.CREATE_DEVICE) {
                const form = formData.CREATE_DEVICE;

                const doc = await DiscoveryModel.findOne({ _id: ObjectId(form._id), pairing: { $ne: true } });
                if (!doc) return res.status(208).send({ error: "deviceNotFound" });

                console.log("user is", user);
                function convertProperties([propertyId, property]: [string, IDiscoveryProperty]) {
                    // TODO validace + konverze
                    let newProperty = assoc("propertyId", propertyId, property);
                    if (!property.format) return newProperty;

                    if (
                        property.dataType === PropertyDataType.float ||
                        property.dataType === PropertyDataType.integer
                    ) {
                        const range = property.format.split(":").map(Number);
                        return assoc("format", { min: range[0], max: range[1] }, newProperty);
                    } else if (property.dataType === PropertyDataType.enum)
                        return assoc("format", property.format.split(","), newProperty);

                    return newProperty;
                }
                function convertDiscoveryThing([nodeId, thing]: [string, IDiscoveryThing]): IThing {
                    return o<IDiscoveryThing, IDiscoveryThing, any>(
                        // ifElse(
                        // 	pathSatisfies<ComponentType, IDiscoveryThing>(
                        // 		(componentType) => componentType in PredefinedComponentType,
                        // 		["config", "componentType"]
                        // 	),
                        // 	(thing: IDiscoveryThing) =>
                        // 		assocPath(
                        // 			["config", "properties"],
                        // 			ThingProperties[(thing.config.componentType as unknown) as PredefinedComponentType],
                        // 			thing
                        // 		),
                        over(lensPath(["config", "properties"]), o(map(convertProperties), toPairs)),
                        // ),
                        assocPath(["config", "nodeId"], nodeId)
                    )(thing);
                }

                const convertThings = o<
                    { [propertyId: string]: IDiscoveryThing },
                    [string, IDiscoveryThing][],
                    IThing[]
                >(map(convertDiscoveryThing), toPairs);
                const newDevice = await DeviceModel.createNew(
                    {
                        info: { ...form.info },
                        things: convertThings(doc.things),
                        metadata: {
                            realm: doc.realm,
                            deviceId: doc.deviceId,
                        },
                    },
                    user.id
                );

                console.log(convertThings(doc.things)[1].config);

                const suuccess = await Actions.deviceInitPairing(doc.deviceId, newDevice.apiKey);
                if (suuccess) {
                    doc.pairing = true;
                    doc.save();
                    res.send({ doc: newDevice });
                } else {
                    newDevice.remove();
                    res.setStatus(500);
                }
            } else res.sendStatus(500);
        },
    });
