import fieldDescriptors from "common/lib/fieldDescriptors";
import { DiscoveryModel, IDiscoveryDocument } from "common/lib/models/deviceDiscoveryModel";
import { DeviceModel } from "common/lib/models/deviceModel";
import { IDiscoveryProperty, IDiscoveryThing, IDiscovery } from "common/lib/models/interface/discovery";
import {
    IThing,

    IThingProperty,
    IThingPropertyEnum,
    IThingPropertyNumeric, PropertyDataType
} from "common/lib/models/interface/thing";
import mongoose from "mongoose";
import { assoc, assocPath, map, o } from "ramda";
import formDataChecker from "../middlewares/formDataChecker";
import resource from "../middlewares/resource-router-middleware";
import tokenAuthMIddleware from "../middlewares/tokenAuth";
import { Actions } from "../services/actionsService";
import eventEmitter from "../services/eventEmitter";
import checkDiscovery from "../middlewares/discovery/checkDiscovery";
import { convertDiscoveryThing } from "../utils/convertDiscoveryThing";

const ObjectId = mongoose.Types.ObjectId;

export default () =>
    resource({
        middlewares: {
            index: [tokenAuthMIddleware()],
            deleteId: [tokenAuthMIddleware(), checkDiscovery()],
            createId: [tokenAuthMIddleware(), checkDiscovery(), formDataChecker(fieldDescriptors, { allowedForms: ["CREATE_DEVICE"] })],
        },

        /** GET / - List all entities */
        async index({ user }: any, res) {
            console.log("user - ", user.info.userName);
            const docs = await DiscoveryModel.find({ realm: user.realm, pairing: { $ne: true } });

            res.send({ docs });
        },

        async deleteId({ params }, res) {
            const { id } = params;

            const result = await DiscoveryModel.deleteMany({
                _id: ObjectId(id),
            });
            console.log("deleted", result);
            eventEmitter.emit("device_delete", id);
            res.sendStatus(204);
        },

        /** POST / - Create a new entity */
        async createId({ body, user, params }: any, res): Promise<void> {
            // TODO permission check
            const { formData } = body;
            const _id = params.id;
            const form = formData.CREATE_DEVICE;

            const doc = await DiscoveryModel.findOne({ _id: ObjectId(_id), pairing: { $ne: true } }) as IDiscoveryDocument;

            const convertThings = map(convertDiscoveryThing);
            const newDevice = await DeviceModel.createNew(
                {
                    info: { ...form.info },
                    things: convertThings(
                        map(nodeId => assocPath(["config", "nodeId"], nodeId, doc.things[nodeId]), doc.nodeIds)
                    ),
                    metadata: {
                        realm: doc.realm,
                        deviceId: doc.deviceId,
                    },
                },
                user.id
            );


            const suuccess = await Actions.deviceInitPairing(doc.deviceId, newDevice.apiKey);
            if (suuccess) {
                doc.pairing = true;
                doc.save();
                res.send({ doc: newDevice });
            } else {
                newDevice.remove();
                res.sendStatus(500);
            }

        },
    });
