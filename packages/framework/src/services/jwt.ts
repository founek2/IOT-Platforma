import jwt from 'jsonwebtoken';
import fs from 'fs';

let privKey: jwt.Secret | null = null;
let pubKey: jwt.Secret | null = null;
let expiresIn: string | undefined = undefined;
const init = function (config: Config) {

    privKey = fs.readFileSync(config.jwt.privateKey);
    pubKey = fs.readFileSync(config.jwt.publicKey);
    expiresIn = config.jwt.expiresIn;
}


const sign = function (object: any) {
    return new Promise(function (resolve, reject) {
        if (privKey === null) {
            reject("Not initialised")
            return;
        }

        jwt.sign(object, privKey, { algorithm: 'RS256', expiresIn: expiresIn }, function (err, token) {
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
