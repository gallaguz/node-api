import { App } from './app';
import { LoggerService } from './logger';
import { UserController } from './user/user.controller';
import { ExceptionFilter } from './errors';

const bootstrap = async () => {
    const logger = new LoggerService();
    const app = new App(
        logger,
        new UserController(logger),
        new ExceptionFilter(logger)
    );
    await app.init();
};

bootstrap();
