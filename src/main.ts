if (!process.env.IS_TS_NODE) require('module-alias/register');

import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import { App } from '@app/app';
import { IConfigService, ConfigService } from '@app/config';
import { PrismaService } from '@app/database';
import { ExceptionFilter, IExceptionFilter } from '@app/errors';
import { ILogger, LoggerService } from '@app/logger';
import { TYPES } from '@app/types';
import {
    UserController,
    IUserController,
    IUserService,
    UserService,
    UserRepository,
    IUserRepository,
} from '@app/users';

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    bind<IUserController>(TYPES.UserController).to(UserController);
    bind<IUserService>(TYPES.UserService).to(UserService);
    bind<PrismaService>(TYPES.PrismaService)
        .to(PrismaService)
        .inSingletonScope();
    bind<IConfigService>(TYPES.ConfigService)
        .to(ConfigService)
        .inSingletonScope();
    bind<IUserRepository>(TYPES.UserRepository)
        .to(UserRepository)
        .inSingletonScope();
    bind<App>(TYPES.Application).to(App);
});

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
