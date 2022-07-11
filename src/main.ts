import 'reflect-metadata';
import { App } from './app';
import { ILogger, LoggerService } from './logger';
import { UsersController } from './users';
import { ExceptionFilter, IExceptionFilter } from './errors';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { IUserController } from './users/users.controller.interface';
import { IUsersService } from './users/users.service.interface';
import { UsersService } from './users/users.service';

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    bind<IUserController>(TYPES.UsersController).to(UsersController);
    bind<IUsersService>(TYPES.UsersService).to(UsersService);
    bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init()
        .then(() => {
            console.log('Initiation success');
        })
        .catch((e) => {
            console.log(e.message);
        });
    return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
