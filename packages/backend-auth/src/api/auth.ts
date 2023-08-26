import { DeviceModel } from 'common/lib/models/deviceModel.js';
import { UserService } from 'common/lib/services/userService.js';
import express, { Response } from 'express';
import { AuthType } from 'common/lib/constants';
import { validatePass } from '../services/TemporaryPass.js';
import { UserModel } from 'common/lib/models/userModel.js';
import { logger } from 'common/lib/logger';

const router = express.Router();

function sendDeny(path: string, res: Response) {
    logger.debug(path, 'deny');
    res.send('deny');
}

function isGuest(userName: string) {
    return userName.startsWith('guest=');
}

function isUser(userName: string) {
    return !isGuest(userName) && !isDevice(userName);
}
function isDevice(userName: string) {
    return userName.startsWith('device=');
}

function splitUserName(userName: string) {
    return removeUserNamePrefix(userName).split('/');
}

function removeUserNamePrefix(userName: string) {
    return userName.replace(/^[^=]+=/, '');
}

/**
 * URL prefix /auth
 * specification https://github.com/rabbitmq/rabbitmq-auth-backend-http
 */

/**
 * Determines whether provided user can log into MQTT broker
 * userName can have following prefixes:
 *  - "guest=" followed by deviceID - for device access to /prefix, password must be targeting realm
 *  - "device=" followed by deviceId - for logging devices with apiKey as password
 *  - without prefix -> user is logging using his userName and password
 * @body { username, password }
 */
router.post('/user', async function (req, res) {
    const { username, password } = req.body;

    logger.debug('username=' + username, 'password=' + password?.replace(/./g, "*"));

    if (isDevice(username)) {
        const [topicPrefix, deviceId] = splitUserName(username);
        const success = await DeviceModel.login(topicPrefix, deviceId, password);
        return success ? res.send('allow') : sendDeny('/user device', res);
    } else if (isUser(username)) {
        if (!password) return sendDeny('/user missing password', res);
        if (validatePass({ userName: username, password })) return res.send('allow administrator');

        const result = await UserService.checkCreditals({
            userName: username,
            password,
            authType: AuthType.passwd,
        });

        result
            .ifRight(
                ({ doc }) =>
                    doc.groups.some((group) => group === 'root' || group === 'admin') && res.send('allow administrator')
            )
            .ifLeft(() => sendDeny('/user user', res));
    } else if (isGuest(username)) {
        // in password is Realm
        const doc = await UserModel.findByUserName(password);
        // "guest" for backward compatibility
        if (doc || password === 'guest') res.send('allow');
        else sendDeny('/user invalid username', res);
    } else sendDeny('/user other', res);
});

/** Determines whether client can access targeted vhost
 * @body { username, vhost, ip }
 */
router.post('/vhost', function (req, res) {
    // console.log("/vhost", req.body)
    if (req.body.vhost === '/') return res.send('allow');
    sendDeny('/vhost', res);
});

/** Determines whether client can access targeted resource
 * @body { username, vhost, resource, name, permission }
 */
router.post('/resource', function (req, res) {
    const { resource, username } = req.body;
    // console.log("/resource", req.body, resource === 'queue' || resource === 'exchange' || /^user=.+/.test(username))
    if (resource === 'queue' || resource === 'exchange' || isUser(username)) return res.send('allow');

    sendDeny('/resource', res);
});

/** Determines whether client can access targeted topic
 * @body { username, vhost, resource, name. permission, routing_key }
 */
router.post('/topic', async function (req, res) {
    // console.log("/topic", req.body)
    const { vhost, username, name, permission, routing_key } = req.body;
    const [realm, deviceId] = splitUserName(username);

    // check if user has access
    if (isUser(username)) {
        if (routing_key.startsWith("prefix."))
            return res.send('allow');
        if (routing_key.startsWith(`v2.${realm}.`))
            return res.send('allow');

        const user = await UserModel.findByUserName(realm);
        if (user?.groups.includes("admin"))
            return res.send('allow');

        return sendDeny('/topic ' + routing_key + ', user=' + username, res);
    }

    if (isDevice(username) && name === 'amq.topic' && vhost === '/') {
        const [realm, deviceId] = splitUserName(username);
        if (routing_key.startsWith(`v2.${realm}.`)) return res.send('allow');

        return sendDeny('/topic ' + routing_key + ', user=' + username, res);
    }

    const matchedConf = routing_key.match(/^prefix\.([^\.]+)\.([^\.]+)(.*)/);
    //console.log("matched", matchedConf);

    /* Allow only write */
    //console.log("cmp", matchedConf[2], username.replace("guest=", ""));
    if (matchedConf && matchedConf[1] === username.replace(/^guest=/, '')) return res.send('allow');

    sendDeny('/topic ' + routing_key + ', user=' + username, res);
});

export default router;
