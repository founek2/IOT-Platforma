import cp from 'child_process';
import path from 'path';
import waitPort from 'wait-port';
import configBE from '../resources/configBE'

export function spawnChild() {
    return cp.fork(path.join(__dirname, "../..", "src", "index.js"), { execPath: "babel-node", silent: true });
}

const params = {
    host: "localhost",
    port: configBE.port,
    timeout: 10 * 1000    // max wait 5s
}

export async function waitForServer() {
   return new Promise((done, reject) => waitPort(params).then(open => {
        if (open) setTimeout(() => done(), 1 * 1000);  // wait 1s -> so server can properly load
        else reject("Can not start backend");
    }))
}

export function killChild(child) {
    child.kill("SIGINT");
}