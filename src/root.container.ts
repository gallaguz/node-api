import { ContainerModule, interfaces } from 'inversify';

import { App } from '@app/app';
import { APP_KEYS } from '@app/app-keys';
import { ConfigService, IConfigService } from '@app/config';
import { PrismaService } from '@app/database';
import { ExceptionFilter, IExceptionFilter } from '@app/filters';
import { ILogger, LoggerService } from '@app/logger';

const ROOT_CONTAINER = new ContainerModule((bind: interfaces.Bind) => {
    // LOGGER
    bind<ILogger>(APP_KEYS.LoggerService).to(LoggerService).inSingletonScope();

    // CONFIG
    bind<IConfigService>(APP_KEYS.ConfigService)
        .to(ConfigService)
        .inSingletonScope();

    // FILTERS
    bind<IExceptionFilter>(APP_KEYS.ExceptionFilter)
        .to(ExceptionFilter)
        .inSingletonScope();

    // PRISMA
    bind<PrismaService>(APP_KEYS.PrismaService)
        .to(PrismaService)
        .inSingletonScope();

    // APP
    bind<App>(APP_KEYS.Application).to(App).inSingletonScope();
});

export { ROOT_CONTAINER };
