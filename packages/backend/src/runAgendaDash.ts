import config from '@common/config';
import { spawn } from 'child_process';
import path from 'path';

const pathToBin = path.resolve(__dirname, '../node_modules/.bin/agendash');

let child: any;
const argv = [`--db=${config.dbUri}`, '--collection=agendaJobs', '--port=8089'];

/**
 * StartUp AgendaDash server - webUI dashboard for agenda jobs
 */
function startChild() {
    console.log('STARTING', process.execPath, 'child.js', argv);
    child = spawn(pathToBin, argv, {
        cwd: process.cwd(),
        env: process.env,
        detached: true,
    });
    child.on('error', function (e: any) {
        console.log(e);
    });
    child.stdout.pipe(process.stdout);
    console.log('STARTED with PID:', child.pid);
}

const callback = function () {
    console.log('Quiting...');
    child.kill();
    process.exit();
};

process.on('SIGQUIT', callback);
process.on('SIGINT', callback);
startChild();
