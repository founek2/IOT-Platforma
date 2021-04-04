import fieldDescriptors from 'common/lib/fieldDescriptors';
import { NotifyModel } from 'common/lib/models/notifyModel';
import { transformNotifyForBE } from 'common/lib/utils/transform';
import checkReadPerm from '../middlewares/device/checkReadPerm';
import checkWritePerm from '../middlewares/device/checkWritePerm';
import formDataChecker from '../middlewares/formDataChecker';
import resource from '../middlewares/resource-router-middleware';
import tokenAuthMIddleware from '../middlewares/tokenAuth';

export default ({ config, db }) =>
    resource({
        mergeParams: true,

        middlewares: {
            update: [
                tokenAuthMIddleware(),
                checkWritePerm({ paramKey: 'deviceId' }),
                formDataChecker(fieldDescriptors)
            ],
            index: [ tokenAuthMIddleware(), checkReadPerm({ paramKey: 'deviceId' }) ]
        },

        async index({ params, user }, res) {
            const { deviceId, nodeId } = params;

            console.log('index', params);

            const doc = await NotifyModel.getForThing(deviceId, nodeId, user.id);
            console.log('items', doc);
            res.send({
                doc: {
                    thing: doc && doc.things ? doc.things[0] : { nodeId, properties: [] }
                }
            });
        },

        // PUT
        update({ params, body: { formData }, user }, res) {
            const { deviceId, nodeId } = params;
            console.log('params', params);
            if (formData.EDIT_NOTIFY) {
                const { properties } = transformNotifyForBE(formData.EDIT_NOTIFY);
                console.log('properties', properties);
                NotifyModel.setForThing(deviceId, nodeId, user.id, properties).then((doc) => {
                    console.log('items', doc);
                    res.send({
                        doc: {
                            things: doc && doc.things ? doc.things : []
                        }
                    });
                });
            }
        }
    });
