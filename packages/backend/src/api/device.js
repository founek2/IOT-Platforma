import resource from 'framework/lib/middlewares/resource-router-middleware';
import Device from '../models/Device';
import processError from 'framework/lib/utils/processError';
import { saveImageBase64, validateFileExtension, deleteImage } from '../service/files';
import { transformSensorsForBE, transformControlForBE } from 'common/lib/utils/transform';
import tokenAuthMIddleware from 'framework/lib/middlewares/tokenAuth';
import formDataChecker from 'framework/lib/middlewares/formDataChecker';

import fieldDescriptors from 'common/lib/fieldDescriptors';
import checkReadPerm from '../middleware/device/checkReadPerm';
import checkWritePerm from '../middleware/device/checkWritePerm';
import checkControlPerm from '../middleware/device/checkControlPerm';
import Notify from '../models/Notification';
import { handleMapping } from 'common/lib/service/DeviceHandler';
import { contains, __, flip, filter, o, prop } from 'ramda';
import eventEmitter from '../service/eventEmitter';
import agenda from '../agenda';

function checkRead(req, res, next) {
	if (req.query.type === 'sensors') return checkReadPerm()(req, res, next);

	if (req.query.type === 'control') return checkControlPerm()(req, res, next);

	if (req.query.type === 'apiKey') return checkWritePerm()(req, res, next);
	res.status(208).send({ error: 'InvalidParam' });
}

// TODO - iot library -> on reconnect device doesnt send actual status
// TODO - api /device just for single device manipulation
export default ({ config, db }) =>
	resource({
		middlewares: {
			index: [ tokenAuthMIddleware({ restricted: false }) ],
			read: [ tokenAuthMIddleware({ restricted: false }), checkRead ],
			updateId: [ tokenAuthMIddleware(), checkWritePerm(), formDataChecker(fieldDescriptors) ],
			create: [ tokenAuthMIddleware(), formDataChecker(fieldDescriptors) ],
			patchId: [ tokenAuthMIddleware(), checkControlPerm(), formDataChecker(fieldDescriptors) ],
			deleteId: [ tokenAuthMIddleware(), checkWritePerm() ]
		},
		/** GET /:param - List all entities */
		read({ params: { id }, query: { from, to = new Date(), type, JSONkey }, user }, res) {
			if (type === 'sensors') {
				if (user && user.admin) {
					Device.getSensorsDataForAdmin(id, new Date(Number(from)), new Date(Number(to)))
						.then((docs) => {
							res.send({ data: docs });
							// res.sendStatus(204)
						})
						.catch(processError(res));
				} else {
					Device.getSensorsData(id, new Date(Number(from)), new Date(Number(to)), user)
						.then((docs) => {
							res.send({ data: docs });
							// res.sendStatus(204)
						})
						.catch(processError(res));
				}
			} else if (type === 'control') {
				Device.getControlData(id, JSONkey, new Date(Number(from)), new Date(Number(to)), user)
					.then((docs) => {
						res.send({ data: docs });
						// res.sendStatus(204)
					})
					.catch(processError(res));
			} else if (type === 'apiKey') {
				Device.getApiKey(id, user).then((apiKey) => res.send({ apiKey })).catch(processError(res)); // TODO not protected for notOwner?
			} else res.sendStatus(404);
		},

		/* PUT */
		updateId({ body, params: { id }, user }, res) {
			const { formData } = body;

			if (formData.EDIT_DEVICE) {
				// tested
				const form = formData.EDIT_DEVICE;
				const image = form.info.image;
				let extension = null;
				if (image) {
					delete form.info.image;
					extension = image.name.split('.').pop();
					if (!validateFileExtension(extension)) {
						res.status(208).send({ error: 'notAllowedExtension' });
						return;
					}
				}
				Device.updateByFormData(id, form, extension, user)
					.then(async (origImgPath) => {
						try {
							if (image && origImgPath) await deleteImage(origImgPath);
						} catch (e) {
							console.log('removing file failed', e);
						}

						try {
							if (image) {
								await saveImageBase64(image.data, id, extension);
							}
							res.sendStatus(204);
						} catch (e) {
							console.log('creating file failed', e);
							res.sendStatus(500);
						}
					})
					.catch(processError(res));
			} else if (formData.EDIT_SENSORS) {
				// tested
				const newJSONkeys = formData.EDIT_SENSORS.JSONkey;
				const { sensors, sampleInterval } = transformSensorsForBE(formData.EDIT_SENSORS);
				Device.updateSensorsRecipe(id, sampleInterval, sensors, user)
					.then(() => {
						Notify.removeSpareSensors(id, newJSONkeys).exec();
						res.sendStatus(204);
					})
					.catch(processError(res));
			} else if (formData.EDIT_PERMISSIONS) {
				// tested
				Device.updatePermissions(id, formData.EDIT_PERMISSIONS, user)
					.then(() => res.sendStatus(204))
					.catch(processError(res));
			} else if (formData.EDIT_CONTROL) {
				const newJSONkeys = formData.EDIT_CONTROL.JSONkey;
				const { control } = transformControlForBE(formData.EDIT_CONTROL);
				Device.updateControlRecipe(id, control, user)
					.then(() => {
						Notify.removeSpareControl(id, newJSONkeys).exec();

						const arrayOfRecipes = filter(
							o(contains(__, Object.keys(handleMapping)), prop('type')),
							control
						);
						console.log('lala', arrayOfRecipes, JSON.stringify(control));
						if (arrayOfRecipes.length) {
							eventEmitter.emit('device_control_recipe_change', {
								recipes: arrayOfRecipes,
								deviceId: id
							});
						}
						res.sendStatus(204);
					})
					.catch(processError(res));
			} else res.sendStatus(500);
		},

		/** POST / - Create a new entity */
		create({ body, user }, res) {
			const { formData } = body;

			if (formData.CREATE_DEVICE) {
				// tested, not saving of file
				const form = formData.CREATE_DEVICE;
				const image = form.info.image;
				delete form.info.image;

				const extension = image.name.split('.').pop();
				if (!validateFileExtension(extension)) {
					res.status(208).send({ error: 'notAllowedExtension' });
				} else
					Device.create(form, extension, user.id)
						.then((doc) => {
							saveImageBase64(image.data, doc.id, extension)
								.then(() => {
									const apiKey = doc.apiKey;
									delete doc.apiKey;
									res.send({ doc, apiKey });
								})
								.catch((err) => res.sendStatus(500)); // TODO - při chybě ukládání obrázku zůstane vytvořené zařízení bez obrázku
						})
						.catch(processError(res));

				// res.send()
			} else res.sendStatus(500);
		},

		/** GET / - List all entities */
		index({ user, root }, res) {
			if (user && user.admin) {
				Device.findForAdmin().then((docs) => {
					res.send({ docs });
				});
			} else if (user) {
				// tested
				Device.findForUser(user.id).then((docs) => {
					res.send({ docs });
				});
			} else {
				Device.findPublic().then((docs) => {
					res.send({ docs });
				});
			}
		},

		/** DELETE - Delete a given entities */
		deleteId({ params, user }, res) {
			// tested, 2
			const { id } = params;
			Device.delete(id, user)
				.then(({ info }) => deleteImage(info.imgPath))
				.then(() => {
					eventEmitter.emit('device_delete', id);
					res.sendStatus(204);
				})
				.catch(processError(res));
		}
	});
