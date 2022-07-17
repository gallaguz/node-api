import 'reflect-metadata';
import { App } from './app';
import { ILogger, LoggerService } from './logger';
import { UserController } from './users';
import { ExceptionFilter, IExceptionFilter } from './errors';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { IUserController } from './users/users.controller.interface';
import { IUserService } from './users/users.service.interface';
import { UserService } from './users/userService';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { UserRepository } from './users/userRepository';
import { IUserRepository } from './users/users.repository.interface';

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

function bootstrap(): IBootstrapReturn {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init()
        .then(() => {
            console.log('[AppInit] Initiation success');
        })
        .catch((e) => {
            console.log(e.message);
        });
    return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
