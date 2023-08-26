import { randomBytes, randomInt } from 'node:crypto';

var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export class Security {
    /**
     * Generate random base64 token with provided length
     * @param {number} size
     */
    static getRandomToken(size: number) {
        const token = randomBytes(Math.floor(size)).toString('base64').slice(0, size);
        return token;
    }

    static getRandomAsciToken(size: number) {
        var result = [];

        var charactersLength = characters.length;
        for (var i = 0; i < size; i++) {
            result.push(characters.charAt(randomInt(charactersLength)));
        }
        return result.join('');
    }
}
