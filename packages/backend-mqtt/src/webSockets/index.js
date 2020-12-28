import { Router } from 'express';
import Jwt from 'framework/lib/services/jwt';
import Device from 'backend/dist/models/Device';
import { publish } from '../service/mqtt';
import { includes } from 'ramda';
import { CONTROL_TYPES } from 'common/lib/constants';
import DeviceHandler, { handleMapping } from 'common/lib/service/DeviceHandler';

export default (io) => {
	io.use((socket, next) => {
		let token = socket.handshake.query.token;
		console.log('middleware loging io');
		Jwt.verify(token)
			.then((payload) => {
				socket.request.user = payload;
				next();
			})
			.catch(() => next());
	});

	io.on('connection', (socket) => {
		console.log('New client connected', socket.request.user ? socket.request.user.id : 'unknown');
		if (socket.request.user) socket.join(socket.request.user.id);

		socket.join('public');

		socket.on('disconnect', () => {
			console.log('Client disconnected');
		});

		socket.on('updateState', async (body, id, fn) => {
			const formData = body.formData;
			try {
				const doc = await Device.findById(id, 'topic control createdBy ').lean();
				console.log('doc', doc, id);
				if (!doc) throw new Error('error');

				const form =
					formData.CHANGE_DEVICE_STATE_SWITCH ||
					formData.CHANGE_DEVICE_STATE_RGB ||
					formData.CHANGE_DEVICE_MUSIC_CAST;
				const recipe = doc.control.recipe.find((obj) => form.JSONkey === obj.JSONkey);
				if (!recipe) return fn({ error: 'invalidKey' });

				if (
					includes(recipe.type, [ CONTROL_TYPES.SWITCH, CONTROL_TYPES.ACTIVATOR, CONTROL_TYPES.RGB_SWITCH ])
				) {
					fn({
						data: {
							current: {
								data: {
									[form.JSONkey]: {
										state: form.state,
										inTransition: true,
										transitionStarted: new Date()
									}
								}
							}
						}
					});

					console.log('publish to', `/${doc.createdBy}${doc.topic}/update`, form.state);
					publish(`/${doc.createdBy}${doc.topic}/update`, { [form.JSONkey]: form.state });
				} else if (includes(recipe.type, Object.keys(handleMapping))) {
					const updateState = await DeviceHandler.handleChange(
						form,
						doc.control.current.data[form.JSONkey],
						recipe
					);
					if (updateState) publish(`/${doc.createdBy}${doc.topic}/ack`, { [form.JSONkey]: updateState });
				} else {
					return fn({ error: 'invalidType' });
				}
			} catch (err) {
				console.log('cant publish:', err);
				fn({ error: 'error' });
			}
		});
	});

	return Router();
};
