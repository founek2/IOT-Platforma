import { Security } from 'common/lib/services/SecurityService';
import addMinutes from 'date-fns/addMinutes';
import isBefore from 'date-fns/isBefore';

export type password = string;
export type Pass = {
    token: password;
    validTo: Date;
} | null;

let currentPass: Pass = null;

export function newPass(): password {
    const token = Security.getRandomToken(12);

    currentPass = { token, validTo: addMinutes(new Date(), 2) };
    return token;
}

export function validatePass(token: password): boolean {
    return Boolean(currentPass && isBefore(new Date(), currentPass.validTo) && currentPass.token === token);
}
