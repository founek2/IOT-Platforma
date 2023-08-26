import express from 'express';
import eventEmitter from '../services/eventEmitter.js';
import { logger } from 'common/lib/logger';
import { IDevice } from 'common/lib/models/interface/device.js';

const router = express.Router();

/**
 * URL prefix /actions
 */

/* Send apiKey to device */
router.put('/device/:deviceId/pairing/init', function (req, res) {
    const deviceId = req.params.deviceId;
    const apiKey = req.body.apiKey;
    logger.debug('ACTIONS body', req.body);
    eventEmitter.emit('device_pairing_init', { deviceId, apiKey });
    res.sendStatus(204);
});

/* Send state change of property to device */
router.patch('/device/:deviceId/thing/:nodeId/property/:propertyId', async function (req, res) {
    const { deviceId, nodeId, propertyId } = req.params;
    const body = req.body as { device: IDevice; value: string | number };

    eventEmitter.emit('device_set_state', { device: body.device, nodeId, propertyId, value: body.value });
    res.sendStatus(204);
});

/* Send command to device */
router.post('/device/:deviceId', async function (req, res) {
    const { deviceId } = req.params;

    eventEmitter.emit('device_send_command', { device: req.body.device, command: req.body.command });
    res.sendStatus(204);
});

export default router;
