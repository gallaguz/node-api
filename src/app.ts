import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users';
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
        @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
    ) {
        this.app = express();
        this.port = 8000;
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
    }

    useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init(): Promise<void> {
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`Started at http://localhost:${this.port}`);
    }
}
