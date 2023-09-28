import cluster from 'cluster';
import os from 'os';
import * as process from 'process';

import { bootstrap } from '@app/bootstrap';

const cpuCount: number = Number(process.env.CPU_COUNT) || os.cpus().length;

if (cluster.isPrimary && cpuCount > 1) {
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker: Worker, code: string, signal: string) => {
        console.error(
            `Worker has been killed. code: ${code}. signal: ${signal}`,
        );
        console.info('Starting another fork');

        cluster.fork();
    });
} else {
    void bootstrap();
}
