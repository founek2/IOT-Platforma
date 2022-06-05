import fieldDescriptors from 'common/src/fieldDescriptors';
import { DiscoveryModel, IDiscoveryDocument } from 'common/src/models/deviceDiscoveryModel';
import { DeviceModel } from 'common/src/models/deviceModel';
import { DeviceStatus } from 'common/src/models/interface/device';
import mongoose from 'mongoose';
import { assocPath, map } from 'ramda';
import checkDiscovery from '../middlewares/discovery/checkDiscovery';
import formDataChecker from '../middlewares/formDataChecker';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';
import { Actions } from '../services/actionsService';
import eventEmitter from '../services/eventEmitter';
import { convertDiscoveryThing } from '../utils/convertDiscoveryThing';

const ObjectId = mongoose.Types.ObjectId;

/**
 * URL prefix /discovery
 */
export default () =>
    resource({
        middlewares: {
            index: [tokenAuthMIddleware()],
            deleteId: [tokenAuthMIddleware(), checkDiscovery()],
            createId: [
                tokenAuthMIddleware(),
                checkDiscovery(),
                formDataChecker(fieldDescriptors, { allowedForms: ['CREATE_DEVICE'] }),
            ],
        },

        /** GET / - List all discovered devices for user
         * @header Authorization-JWT
         * @return json { docs: IDiscovery[] }
         */
        async index({ user }: any, res) {
            const docs = await DiscoveryModel.find({
                'state.status.value': {
                    $exists: true,
                },
                realm: user.realm,
                pairing: { $ne: true },
            });

            res.send({ docs });
        },

        /** GET /:id - Delete provided discovered device
         * @restriction device was discovered for this user
         * @header Authorization-JWT
         */
        async deleteId({ params }, res) {
            const { id } = params;

            const result = await DiscoveryModel.deleteMany({
                _id: ObjectId(id),
            });

            eventEmitter.emit('device_delete', id);
            res.sendStatus(204);
        },

        /** POST /:id - Create new device based on the one discovered (specified by param id)
         * @restriction device was discovered for this user
         * @header Authorization-JWT
         * @body form CREATE_DEVICE
         * @return json { doc: IDevice }
         */
        async createId({ body, user, params }: any, res) {
            // TODO permission check
            const { formData } = body;
            const _id = params.id;
            const form = formData.CREATE_DEVICE;

            const doc = (await DiscoveryModel.findOne({
                // check if discovered device is Ready and not already pairing
                _id: ObjectId(_id),
                pairing: { $ne: true },
                'state.status.value': DeviceStatus.ready,
            })) as IDiscoveryDocument;
            if (!doc) return res.status(400).send({ error: 'deviceNotReady' });

            const convertThings = map(convertDiscoveryThing);
            const metadata = {
                realm: doc.realm,
                deviceId: doc.deviceId,
            };

            if (await DeviceModel.checkIdTaken(metadata)) return res.status(400).send({ error: 'deviceIdTaken' });
            const newDevice = await DeviceModel.createNew(
                // convert discovered device to new device
                {
                    info: { ...form.info },
                    things: convertThings(
                        map((nodeId) => assocPath(['config', 'nodeId'], nodeId, doc.things[nodeId]), doc.nodeIds)
                    ),
                    metadata,
                },
                user.id
            );

            const suuccess = await Actions.deviceInitPairing(doc.deviceId, newDevice.apiKey); // initialize pairing proccess

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
