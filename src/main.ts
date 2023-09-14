import 'reflect-metadata';

import cluster from 'cluster';
import os from 'os';
import process from 'process';

import { App } from '@app/app';
import { APP_KEYS } from '@app/app-keys';
import { appContainer } from '@app/bootstrap';
import { ILogger } from '@app/logger/logger.interface';

const app = appContainer.get<App>(APP_KEYS.Application);
const logger: ILogger = appContainer.get<ILogger>(APP_KEYS.LoggerService);

const cpuCount: number = Number(process.env.CPU_COUNT) || os.cpus().length;

if (cluster.isPrimary) {
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker: Worker, code: string, signal: string) => {
        logger.error(
            `worker has been killed. code: ${code}. signal: ${signal}`,
        );
        logger.info('Starting another fork');

        cluster.fork();
    });
} else {
    app.init()
        .then(() => {
            logger.info(`Initiation success`);
        })
        .catch((error: unknown): void => {
            if (error instanceof Error) {
                logger.error(error.message);
            }
        })
        .finally(() => {
            console.log(process.pid);
        });
}
