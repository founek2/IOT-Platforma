import { DeviceModel } from "common/lib/models/deviceModel";
import { UserService } from "common/lib/services/userService";
import express, { Response } from "express";
import { AuthTypes } from "common/lib/constants";

const router = express.Router();

function sendDeny(path: string, res: Response) {
    console.log(path, "deny");
    res.send("deny");
}

function isGuest(userName: string) {
    return userName.startsWith("guest=");
}

function isUser(userName: string) {
    return !isGuest(userName) && !isDevice(userName);
}
function isDevice(userName: string) {
    return userName.startsWith("device=");
}

function splitUserName(userName: string) {
    return removeUserNamePrefix(userName).split("/");
}

function removeUserNamePrefix(userName: string) {
    return userName.replace(/^[^=]+=/, "");
}

/**
 * password is apiKey
 */
router.post("/user", async function (req, res) {
    // console.log('/user', req.body);
    const { username, password } = req.body;
    console.info("username=" + username, "password=" + password);
    if (isDevice(username)) {
        const [topicPrefix, deviceId] = splitUserName(username);
        console.log("loging", topicPrefix, deviceId, password);
        const success = await DeviceModel.login(topicPrefix, deviceId, password);
        return success ? res.send("allow") : sendDeny("/user device", res);
    } else if (isUser(username)) {
        UserService.checkCreditals({ userName: username, password, authType: AuthTypes.PASSWD })
            .then(({ doc }) => {
                if (doc.groups.some((group) => group === "root" || group === "admin"))
                    return res.send("allow administrator");
                throw new Error();
            })
            .catch(() => sendDeny("/user user", res));
    } else if (isGuest(username)) {
        res.send("allow");
    } else
        sendDeny("/user other", res)
});

router.post("/vhost", function (req, res) {
    // console.log("/vhost", req.body)
    if (req.body.vhost === "/") return res.send("allow");
    sendDeny("/vhost", res);
});

router.post("/resource", function (req, res) {
    const { resource, username } = req.body;
    // console.log("/resource", req.body, resource === 'queue' || resource === 'exchange' || /^user=.+/.test(username))
    if (resource === "queue" || resource === "exchange" || isUser(username)) return res.send("allow");

    sendDeny("/resource", res);
});

router.post("/topic", async function (req, res) {
    // console.log("/topic", req.body)
    const { vhost, username, name, permission, routing_key } = req.body;
    if (isUser(username)) return res.send("allow");

    if (isDevice(username) && name === "amq.topic" && vhost === "/") {
        // const { ownerId, topic } = await Device.getOwnerAndTopic(username);

        console.log("should check access to topic");
        return res.send("allow");
    }

    const matchedConf = routing_key.match(/^prefix\.([^\.]+)\.([^\.]+)(.*)/);
    //console.log("matched", matchedConf);

    /* Allow only write */
    //console.log("cmp", matchedConf[2], username.replace("guest=", ""));
    if (matchedConf && matchedConf[1] === username.replace(/^guest=/, "")) res.send("allow");
    else sendDeny("/topic " + routing_key + ", user=" + username, res);
});

export default router;
