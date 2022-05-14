import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './user';
import { ExceptionFilter } from './errors';
import { ILogger } from './logger';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter
    ) {
        this.app = express();
        this.port = 8000;
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
