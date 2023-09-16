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

    // APP
    bind<App>(APP_KEYS.Application).to(App);
});

export { ROOT_CONTAINER };
