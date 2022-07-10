import 'reflect-metadata';
import { App } from './app';
import { ILogger, LoggerService } from './logger';
import { UserController } from './users';
import { ExceptionFilter, IExceptionFilter } from './errors';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    bind<UserController>(TYPES.UserController).to(UserController);
    bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
