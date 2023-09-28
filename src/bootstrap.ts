import 'reflect-metadata';

import process from 'process';

import { Container } from 'inversify';

import { App } from '@app/app';
import { APP_KEYS } from '@app/app-keys';
import { ILogger } from '@app/logger';
import { PASSWORD_CONTAINER } from '@app/password';
import { ROOT_CONTAINER } from '@app/root.container';
import { TOKEN_CONTAINER } from '@app/token';
import { USER_CONTAINER } from '@app/user';

export async function bootstrap(): Promise<void> {
    const appContainer: Container = new Container();
    appContainer.load(ROOT_CONTAINER);
    appContainer.load(USER_CONTAINER);
    appContainer.load(TOKEN_CONTAINER);
    appContainer.load(PASSWORD_CONTAINER);

    const app = appContainer.get<App>(APP_KEYS.Application);
    const loggerService = appContainer.get<ILogger>(APP_KEYS.LoggerService);

    await app
        .init()
        .then(() => {
            loggerService.info(`[ APP ] Initiation success`);
        })
        .catch((error: unknown): void => {
            if (error instanceof Error) {
                loggerService.error(error.message);
            }
        })
        .finally(() => {
            loggerService.debug(`[ PID ] ${process.pid}`);
        });
}
