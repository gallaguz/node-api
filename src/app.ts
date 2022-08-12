import 'reflect-metadata';

import { Server } from 'http';

import { json } from 'body-parser';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

import { AuthMiddleware } from '@app/common';
import { IConfigService } from '@app/config';
import { PrismaService } from '@app/database';
import { IExceptionFilter } from '@app/errors';
import { ILogger } from '@app/logger';
import { TYPES } from '@app/types';
import { UserController } from '@app/users';

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter)
        private exceptionFilter: IExceptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {
        this.app = express();
        this.port = Number(this.configService.get('PORT'));
    }

    useMiddleware(): void {
        this.app.use(json());
        const authMiddleware = new AuthMiddleware(
            this.configService.get('SECRET'),
        );
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
    }

    useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilters();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(`Started at http://localhost:${this.port}`);
    }

    public close(): void {
        this.server.close();
    }
}
