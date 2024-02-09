import { bindServer } from '../../src/main';
import config from "../resources/config";
import express from "express"
import { spawnDatabase } from "common/__test__/helpers/setup"
import { setGlobalApp } from 'common/__test__/helpers/superTest';
import { BusEmitter } from 'common/lib/interfaces/asyncEmitter';

export default async function () {
    if (process.env.SPAWN_DATABASE) {
        await spawnDatabase(config)
    }

    const { app } = await bindServer(express(), config, new BusEmitter());
    setGlobalApp(app)
}
