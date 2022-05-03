import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './user';
import { ExceptionFilter } from './errors';
import { ILogger } from './logger';

export class App {
    app: Express;
    server: Server;
    port: number;
    logger: ILogger;
    userController: UserController;
    exceptionFilter: ExceptionFilter;

    constructor(
        logger: ILogger,
        userController: UserController,
        exceptionFilter: ExceptionFilter
    ) {
        this.app = express();
        this.port = 8000;
        this.logger = logger;
        this.userController = userController;
        this.exceptionFilter = exceptionFilter;
    }

    useRoutes() {
        this.app.use('/users', this.userController.router);
    }

    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init() {
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`Started at http://localhost:${this.port}`);
    }
}
