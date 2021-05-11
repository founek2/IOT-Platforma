import crypto from 'crypto';
import base64url from 'base64url';

export class Security {
    /**
     * Generate random base64 token with provided length
     * @param {number} size
     */
    static getRandomToken(size: number) {
        const token = crypto.randomBytes(Math.floor(size)).toString('base64').slice(0, size);
        return base64url.fromBase64(token);
    }
}
