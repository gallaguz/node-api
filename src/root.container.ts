import { ContainerModule, interfaces } from 'inversify';

import { App } from '@app/app';
import { APP_KEYS } from '@app/app-keys';
import { ConfigService } from '@app/config/config.service';
import { IConfigService } from '@app/config/config.service.interface';
import { PrismaService } from '@app/database/prisma.service';
import { ExceptionFilter } from '@app/filters/exception.filter';
import { IExceptionFilter } from '@app/filters/exception.filter.interface';
import { ILogger } from '@app/logger/logger.interface';
import { LoggerService } from '@app/logger/logger.service';
import { PasswordService } from '@app/password/password.service';
import { IPasswordService } from '@app/password/password.service.interface';
import { TokenRepository } from '@app/token/token.repository';
import { ITokenRepository } from '@app/token/token.repository.interface';
import { TokenService } from '@app/token/token.service';
import { ITokenService } from '@app/token/token.service.interface';
import { UserController } from '@app/user/user.controller';
import { IUserController } from '@app/user/user.controller.interface';
import { UserRepository } from '@app/user/user.repository';
import { IUserRepository } from '@app/user/user.repository.interface';
import { UserService } from '@app/user/user.service';
import { IUserService } from '@app/user/user.service.interface';

const ROOT_CONTAINER = new ContainerModule((bind: interfaces.Bind) => {
    // LOGGER
    bind<ILogger>(APP_KEYS.LoggerService).to(LoggerService).inSingletonScope();

    // FILTERS
    bind<IExceptionFilter>(APP_KEYS.ExceptionFilter).to(ExceptionFilter);

    // PRISMA
    bind<PrismaService>(APP_KEYS.PrismaService)
        .to(PrismaService)
        .inSingletonScope();

    // CONFIG
    bind<IConfigService>(APP_KEYS.ConfigService)
        .to(ConfigService)
        .inSingletonScope();

    // USER
    // bind<IUserController>(APP_KEYS.UserController).to(UserController);
    // bind<IUserService>(APP_KEYS.UserService).to(UserService);
    // bind<IUserRepository>(APP_KEYS.UserRepository)
    //     .to(UserRepository)
    //     .inSingletonScope();

    // TOKEN
    // bind<ITokenService>(APP_KEYS.TokenService).to(TokenService);
    // bind<ITokenRepository>(APP_KEYS.TokenRepository).to(TokenRepository);

    // PASSWORD
    // bind<IPasswordService>(APP_KEYS.PasswordService).to(PasswordService);

    // APP
    bind<App>(APP_KEYS.Application).to(App);
});

export { ROOT_CONTAINER };
