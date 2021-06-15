import { Security } from './SecurityService';
import addMinutes from 'date-fns/addMinutes';
import isBefore from 'date-fns/isBefore';
import { UserModel } from '../models/userModel';

export type Pass = {
    password: string;
    userName: string;
    validTo: Date;
} | null;

let currentPass: Pass = null;

async function newPass(): Promise<Pass> {
    const token = Security.getRandomToken(12);
    const doc = await UserModel.findOne({ groups: 'root' }).lean();
    if (!doc?.info.userName) return null;

    return { validTo: addMinutes(new Date(), 60), userName: doc.info.userName, password: token };
}

export async function getPass(): Promise<Pass> {
    if (!currentPass || currentPass.validTo <= new Date()) currentPass = await newPass();
    return currentPass;
}

export function validatePass(pass: { userName: string; password: string }): boolean {
    const valid = Boolean(
        currentPass && isBefore(new Date(), currentPass.validTo) && currentPass.password === pass.password
    );
    console.log('validate pass', pass.password, currentPass?.password, valid);

    return valid;
}
