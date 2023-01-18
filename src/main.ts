if (!process.env.IS_TS_NODE) require('module-alias/register');

import 'reflect-metadata';
import { App } from './app';
import { ILogger, LoggerService } from './logger';
import { UserController } from './users';
import { ExceptionFilter, IExceptionFilter } from './errors';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { IUserController } from '@app/users';
import { IUserService } from '@app/users';
import { UserService } from '@app/users';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { UserRepository } from '@app/users';
import { IUserRepository } from '@app/users';

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    bind<IUserController>(TYPES.UserController).to(UserController);
    bind<IUserService>(TYPES.UserService).to(UserService);
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
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
