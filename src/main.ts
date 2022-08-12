if (!process.env.IS_TS_NODE) require('module-alias/register');

import 'reflect-metadata';

import { Container } from 'inversify';

import { App } from '@app/app';
import { appBindings } from '@app/inversify';
import { LoggerService } from '@app/logger';
import { TYPES } from '@app/types';

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

async function bootstrap(): Promise<IBootstrapReturn> {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    await app
        .init()
        .then(() => {
            console.log('[AppInit] Initiation success');
        })
        .catch((e) => {
            console.log(e.message);
        });
    return { app, appContainer };
}

export const boot = bootstrap();
