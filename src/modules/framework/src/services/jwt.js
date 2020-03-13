import jwt from 'jsonwebtoken';
import fs from 'fs';

/* global Promise */

let privKey = null;
let pubKey = null;
const init = function (config) {

	privKey = fs.readFileSync(config.privateKey);
	pubKey = fs.readFileSync(config.publicKey);
}


const sign = function(object) {
     return new Promise(function(resolve, reject) {
          jwt.sign(object, privKey, { algorithm: 'RS256', expiresIn: '14 days' }, function(err, token) {
               if (!err) {
                    resolve(token);
               } else {
                    reject(err);
               }
          });
     });
};
const verify = function(token) {
     return new Promise(function(resolve, reject) {
          jwt.verify(token, pubKey, { algorithms: ['RS256'] }, function(err, payload) {
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
