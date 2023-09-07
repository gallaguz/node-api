import { ContainerModule, interfaces } from 'inversify';

import { App } from '@app/app';
import { ConfigService, IConfigService } from '@app/config';
import { PrismaService } from '@app/database';
import { ExceptionFilter, IExceptionFilter } from '@app/filters';
import { TYPES } from '@app/types';
import { ILogger, LoggerService } from 'src/common/logger';
import {
    TokenService,
    ITokenService,
    ITokenRepository,
    TokenRepository,
} from 'src/token';
import {
    IUserController,
    IUserRepository,
    IUserService,
    UserController,
    UserRepository,
    UserService,
} from 'src/user';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();

    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);

    bind<PrismaService>(TYPES.PrismaService)
        .to(PrismaService)
        .inSingletonScope();

    bind<IConfigService>(TYPES.ConfigService)
        .to(ConfigService)
        .inSingletonScope();

    bind<IUserController>(TYPES.UserController).to(UserController);
    bind<IUserService>(TYPES.UserService).to(UserService);
    bind<IUserRepository>(TYPES.UserRepository)
        .to(UserRepository)
        .inSingletonScope();

    bind<ITokenService>(TYPES.TokenService).to(TokenService);
    bind<ITokenRepository>(TYPES.TokenRepository).to(TokenRepository);

    bind<App>(TYPES.Application).to(App);
});

export { appBindings };
