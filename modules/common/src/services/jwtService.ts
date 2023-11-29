import jwt from 'jsonwebtoken';
import fs from 'fs';
import { logger } from '../logger';

interface RefreshTokenPayload {
    id: string, userId: string
}

export class JwtService {
    privKey: jwt.Secret
    pubKey: jwt.Secret
    expiresIn: string = "14d"

    constructor({
        privateKey,
        publicKey,
        expiresIn: exIn,
    }: {
        privateKey: string;
        publicKey: string;
        expiresIn: string;
    }) {
        if (!privateKey) logger.error('JWT invalid privateKey path:', privateKey);
        if (!publicKey) logger.error('JWT invalid publicKey path:', publicKey);
        if (!exIn) logger.error('JWT invalid expiresIn:', exIn);

        this.privKey = fs.readFileSync(privateKey);
        this.pubKey = fs.readFileSync(publicKey);
        this.expiresIn = exIn;
    }

    /**
     * Create JWT token from provided object
     * @param object
     * @return JWTtoken
     */
    sign(object: any): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(object, this.privKey, { algorithm: 'RS256', expiresIn: "15min" }, function (err, token) {
                if (!err && token) {
                    resolve(token);
                } else {
                    reject(err);
                }
            });
        });
    }


    /**
     * Create JWT token from provided object
     * @param object
     * @return JWTtoken
     */

    signRefreshToken(object: RefreshTokenPayload): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(object, this.privKey, { algorithm: 'RS256', subject: "refreshToken" }, function (err, token) {
                if (!err && token) {
                    resolve(token);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * Verify JWT token and decode its content
     * @param token
     * @return token content
     */
    verify(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.pubKey, { algorithms: ['RS256'] }, function (err, payload) {
                if (!err) {
                    resolve(payload);
                } else {
                    reject('invalidToken');
                }
            });
        });
    }

    verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.pubKey, { algorithms: ['RS256'], subject: "refreshToken" }, function (err, payload) {
                if (!err && payload) {
                    resolve(payload as any);
                } else {
                    reject('invalidToken');
                }
            });
        });
    }

}









