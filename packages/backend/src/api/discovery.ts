import fieldDescriptors from 'common/src/fieldDescriptors';
import { DiscoveryModel, IDiscoveryDocument } from 'common/src/models/deviceDiscoveryModel';
import { DeviceModel } from 'common/src/models/deviceModel';
import { DeviceStatus } from 'common/src/models/interface/device';
import { RequestWithAuth } from 'common/src/types';
import mongoose from 'mongoose';
import { assocPath, equals, map } from 'ramda';
import checkDiscovery from 'common/src/middlewares/discovery/checkDiscovery';
import formDataChecker from 'common/src/middlewares/formDataChecker';
import resource from 'common/src/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/src/middlewares/tokenAuth';
import { Actions } from '../services/actionsService';
import eventEmitter from '../services/eventEmitter';
import { convertDiscoveryThing } from '../utils/convertDiscoveryThing';
import { IThing } from 'common/src/models/interface/thing';
import { extractPlainConfig } from '../utils/extractPlainConfig';
import util from 'util';
import { logger } from 'framework-ui/src/logger';

const ObjectId = mongoose.Types.ObjectId;

type Request = RequestWithAuth;
type RequestId = RequestWithAuth & { params: { id: string } };

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
        async index({ user }: Request, res) {
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
        async deleteId({ params }: RequestId, res) {
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
        async createId({ body, user, params }: RequestId, res) {
            const { formData } = body;
            const _id = params.id;
            const form = formData.CREATE_DEVICE;

            const discoverdDevice = (await DiscoveryModel.findOne({
                // check if discovered device is Ready and not already pairing
                _id: ObjectId(_id),
                pairing: { $ne: true },
                'state.status.value': DeviceStatus.ready,
            })) as IDiscoveryDocument;
            if (!discoverdDevice) return res.status(400).send({ error: 'deviceNotReady' });

            // convert discovered device to new device
            const convertThings = map(convertDiscoveryThing);
            const things = convertThings(
                map(
                    (nodeId) => assocPath(['config', 'nodeId'], nodeId, discoverdDevice.things[nodeId]),
                    discoverdDevice.nodeIds
                )
            );

            async function getOrCreateDevice(doc: IDiscoveryDocument, things: IThing[], form: any) {
                const metadata = {
                    realm: doc.realm,
                    deviceId: doc.deviceId,
                };

                const alreadyExist = await DeviceModel.findOne({ metadata }).lean();
                if (alreadyExist) {
                    const existingConfig = alreadyExist.things.map(extractPlainConfig);
                    const newConfig = things.map(extractPlainConfig);

                    logger.silly('existingConfig', util.inspect(existingConfig, { showHidden: false, depth: null }));
                    logger.silly('newConfig', util.inspect(newConfig, { showHidden: false, depth: null }));

                    if (equals(existingConfig, newConfig)) {
                        // device exists with same config -> reuse it!
                        return alreadyExist;
                    } else {
                        // different config -> don`t reuse
                        return null;
                    }
                }

                return DeviceModel.createNew(
                    {
                        info: { ...form.info },
                        things,
                        metadata,
                    },
                    user._id
                );
            }

            const newDevice = await getOrCreateDevice(discoverdDevice, things, form);
            if (!newDevice) return res.status(400).send({ error: 'deviceIdTaken' });

            const suuccess = await Actions.deviceInitPairing(discoverdDevice.deviceId, newDevice.apiKey); // initialize pairing proccess

            if (suuccess) {
                discoverdDevice.pairing = true;
                discoverdDevice.save();
                res.send({ doc: newDevice });
            } else {
                DeviceModel.deleteOne({ _id: newDevice._id });
                res.sendStatus(500);
            }
        },
    });
