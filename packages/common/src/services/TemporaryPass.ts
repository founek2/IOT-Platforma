import { Security } from './SecurityService';
import addMinutes from 'date-fns/addMinutes';
import isBefore from 'date-fns/isBefore';
import { UserModel } from '../models/userModel';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';

export type Pass = {
    password: string;
    userName: string;
    validTo: Date;
};

let currentPass: Maybe<Pass> = Nothing;

async function newPass(): Promise<Maybe<Pass>> {
    console.log('Generating new pass');
    const token = Security.getRandomToken(12);
    const doc = await UserModel.findOne({ groups: 'root' }).lean();
    if (!doc?.info.userName) return Nothing;

    return Just({ validTo: addMinutes(new Date(), 60), userName: doc.info.userName, password: token });
}

export async function getPass(): Promise<Maybe<Pass>> {
    currentPass = await new Promise((res) => {
        currentPass
            .ifJust(async (pass) => (pass.validTo <= new Date() ? res(await newPass()) : res(Just(pass))))
            .ifNothing(async () => res(await newPass()));
    });

    return currentPass;
}

export function validatePass(pass: { userName: string; password: string }): boolean {
    console.log('validate pass', currentPass.extract(), pass);
    return currentPass
        .map((curr) => isBefore(new Date(), curr.validTo) && curr.password === pass.password)
        .orDefault(false);
}
