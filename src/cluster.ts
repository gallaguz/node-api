import cluster from 'cluster';
import os from 'os';
import process from 'process';

import { bootstrap } from './bootstrap';

const cpuCount: number = Number(process.env.CPU_COUNT) || os.cpus().length;

if (cluster.isPrimary && cpuCount > 1) {
    console.info({ primaryPid: process.pid });

    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
        console.error(
            `Worker has been killed. code: ${code}. signal: ${signal}`,
        );

        if (code !== 0) {
            console.info('Starting another fork');

            cluster.fork();
        }
    });
} else {
    void bootstrap();
}

process.on('SIGTERM', () => {
    // process.env.IS_TERMINATED = String(1);

    for (const id in cluster.workers) {
        if (cluster.workers[id]) {
            cluster.workers[id]?.kill('SIGTERM');
        }
    }
});
