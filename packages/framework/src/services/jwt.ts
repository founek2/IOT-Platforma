import jwt from 'jsonwebtoken';
import fs from 'fs';
import logger from "framework-ui/lib/logger"

let privKey: jwt.Secret | null = null;
let pubKey: jwt.Secret | null = null;
let expiresIn: string | undefined = undefined;
const init = function ({ privateKey, publicKey, expiresIn: exIn }: { privateKey: string, publicKey: string, expiresIn: string }) {

    if (!privateKey) logger.error("JWT invalid privateKey path:", privateKey)
    if (!publicKey) logger.error("JWT invalid publicKey path:", publicKey)
    if (!expiresIn) logger.error("JWT invalid expiresIn:", expiresIn)

    privKey = fs.readFileSync(privateKey);
    pubKey = fs.readFileSync(publicKey);
    expiresIn = exIn;
}


const sign = function (object: any) {
    return new Promise(function (resolve, reject) {
        if (privKey === null) {
            reject("Not initialised")
            return;
        }

        jwt.sign(object, privKey, { algorithm: 'RS256', expiresIn }, function (err, token) {
            if (!err) {
                resolve(token);
            } else {
                reject(err);
            }
        });
    });
};
const verify = function (token: string) {
    return new Promise(function (resolve, reject) {
        if (pubKey === null) {
            reject("Not initialised")
            return;
        }


        jwt.verify(token, pubKey, { algorithms: ['RS256'] }, function (err, payload) {
            if (!err) {
                resolve(payload);
            } else {
                reject('invalidToken');
            }
        });
    });
};


export default {
    sign,
    verify,
    init
};
