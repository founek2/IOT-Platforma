import { bindServer } from '../../src/main';
import config from "../resources/config";
import express from "express"
import { spawnDatabase } from "common/__test__/helpers/setup"
import { setGlobalApp } from 'common/__test__/helpers/superTest';
import { ITemporaryPass } from 'common/src/interfaces/ITemporaryPass';
import { Nothing } from 'purify-ts';

class PassDummy implements ITemporaryPass {
    async getPass() {
        return Nothing;
    }
}

export default async function () {
    if (process.env.SPAWN_DATABASE) {
        await spawnDatabase(config)
    }

    const { app } = await bindServer(express(), config, new PassDummy());
    setGlobalApp(app)
}
