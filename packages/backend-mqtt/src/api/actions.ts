import express from 'express';
import eventEmitter from '../services/eventEmitter';

const router = express.Router();

/**
 * URL prefix /actions
 */

/* Send apiKey to device */
router.put('/device/:deviceId/pairing/init', function (req, res) {
    console.log('action /device pairing init');
    const deviceId = req.params.deviceId;
    const apiKey = req.body.apiKey;
    console.log('ACTIONS body', req.body);
    eventEmitter.emit('device_pairing_init', { deviceId, apiKey });
    res.sendStatus(204);
});

/* Send state change of property to device */
router.patch('/device/:deviceId/thing/:nodeId/property/:propertyId', async function (req, res) {
    console.log('action update property state', req.params, req.body);
    const { deviceId, nodeId, propertyId } = req.params;

    eventEmitter.emit('device_set_state', { device: req.body.device, nodeId, propertyId, value: req.body.value });
    res.sendStatus(204);
});

/* Send command to device */
router.post('/device/:deviceId', async function (req, res) {
    const { deviceId } = req.params;

    eventEmitter.emit('device_send_command', { device: req.body.device, command: req.body.command });
    res.sendStatus(204);
});

export default router;
