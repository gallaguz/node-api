import { ContainerModule, interfaces } from 'inversify';

import { App } from '@app/app';
import { ConfigService, IConfigService } from '@app/config';
import { PrismaService } from '@app/database';
import { ExceptionFilter, IExceptionFilter } from '@app/errors';
import { ILogger, LoggerService } from '@app/logger';
import { TYPES } from '@app/types';
import {
    IUserController,
    IUserRepository,
    IUserService,
    UserController,
    UserRepository,
    UserService,
} from '@app/users';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
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

export { appBindings };
