import crypto from 'crypto';
import base64url from 'base64url';

var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export class Security {
    /**
     * Generate random base64 token with provided length
     * @param {number} size
     */
    static getRandomToken(size: number) {
        const token = crypto.randomBytes(Math.floor(size)).toString('base64').slice(0, size);
        return base64url.fromBase64(token);
    }

    static getRandomAsciToken(size: number) {
        var result = [];

        var charactersLength = characters.length;
        for (var i = 0; i < size; i++) {
            result.push(characters.charAt(crypto.randomInt(charactersLength)));
        }
        return result.join('');
    }
}
