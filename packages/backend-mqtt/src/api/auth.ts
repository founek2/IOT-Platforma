import { DeviceModel } from 'common/lib/models/deviceModel';
import { UserService } from 'common/lib/services/userService';
import express, { Response } from 'express';
import { AuthType } from 'common/lib/constants';
import { validatePass } from 'common/lib/services/TemporaryPass';
import { UserModel } from 'common/lib/models/userModel';

const router = express.Router();

function sendDeny(path: string, res: Response) {
    console.log(path, 'deny');
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
 *  - "host=" followed by deviceId - for host access (without autentification)
 *  - "device=" followed by deviceId - for paired devices with apiKey as password
 *  - without prefix -> user is logging using his userName and password
 * @body { username, password }
 */
router.post('/user', async function (req, res) {
    // console.log('/user', req.body);
    const { username, password } = req.body;
    console.info('username=' + username, 'password=' + password);
    if (isDevice(username)) {
        const [topicPrefix, deviceId] = splitUserName(username);
        console.log('loging', topicPrefix, deviceId, password);
        const success = await DeviceModel.login(topicPrefix, deviceId, password);
        return success ? res.send('allow') : sendDeny('/user device', res);
    } else if (isUser(username)) {
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
        res.send('allow');
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
    if (isUser(username)) return res.send('allow'); // TODO check if user has access

    if (isDevice(username) && name === 'amq.topic' && vhost === '/') {
        // const { ownerId, topic } = await Device.getOwnerAndTopic(username);
        const [realm, deviceId] = splitUserName(username);
        if (routing_key.startsWith('v2.' + realm + '.')) return res.send('allow');

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
