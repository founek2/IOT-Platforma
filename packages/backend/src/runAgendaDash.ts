import config from './config'
import { spawn } from "child_process";
import createMongoUri from './lib/createMongoUri';
import path from 'path'

const pathToBin = path.resolve(__dirname, "../node_modules/.bin/agendash")

let child: any;
const argv = [`--db=${createMongoUri(config.agenda)}`, "--collection=agendaJobs", "--port=8089"]

function startChild() {
    console.log("STARTING", process.execPath, "child.js", argv);
    child = spawn(pathToBin, argv, {
        cwd: process.cwd(),
        env: process.env,
        detached: true
    });
    child.on('error', function (e: any) { console.log(e) });
    child.stdout.pipe(process.stdout);
    console.log("STARTED with PID:", child.pid);
}

const callback = function () {
    console.log("Quiting...")
    child.kill();
    process.exit()
}

process.on('SIGQUIT', callback);
process.on('SIGINT', callback);
startChild();