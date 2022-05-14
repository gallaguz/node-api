import 'reflect-metadata';
import { App } from './app';
import { ILogger, LoggerService } from './logger';
import { UserController } from './user';
import { ExceptionFilter, IExceptionFilter } from './errors';
import { Container } from 'inversify';
import { TYPES } from './types';

// const logger = new LoggerService();
// const app = new App(
//     logger,
//     new UserController(logger),
//     new ExceptionFilter(logger)
// );

const appContainer = new Container();
appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
appContainer.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
appContainer.bind<UserController>(TYPES.UserController).to(UserController);
appContainer.bind<App>(TYPES.Application).to(App);
const app = appContainer.get<App>(TYPES.Application);
app.init();

export { app, appContainer };
